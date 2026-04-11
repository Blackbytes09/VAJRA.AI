
import time
import torch
import torch.quantization
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from security_manager import SecurityManager
from database_manager import DatabaseManager
import json

class VajraCore:
    def __init__(self, db_manager):
        self.db = db_manager
        self.security = SecurityManager()

    @staticmethod
    def quantize_model(model):
        """
        CTO POV: Dynamic Quantization for Server-Lite.
        Reduces model size by 4x and increases CPU speed by 2x.
        """
        return torch.quantization.quantize_dynamic(
            model, {torch.nn.Linear}, dtype=torch.qint8
        )

    def analyze_image(self, image_pil, file_bytes, filename):
        t0 = time.time()
        file_hash = self.security.generate_file_hash(file_bytes)
        
        # 1. Cache Check
        cached_result = self.db.check_cache(file_hash)
        if cached_result:
            return {**json.loads(cached_result['metadata']), "cached": True, "verdict": cached_result['verdict'], "score": cached_result['score']}
        
        # 2. Tier 1: Fast Analysis (ELA + FFT)
        ela_result = self._ela_analysis(image_pil)
        freq_result = self._freq_analysis(image_pil)
        fast_score = (ela_result['score'] + freq_result['score']) / 2
        
        # 3. Decision Point: Is it suspicious enough for Deep Analysis?
        verdict = "SUSPICIOUS" if fast_score < 70 else "DEEPFAKE"
        if fast_score < 35: verdict = "AUTHENTIC"
            
        result = {
            "id": f"VAJ-{int(time.time())}",
            "filename": filename,
            "file_hash": file_hash,
            "verdict": verdict,
            "score": round(fast_score, 2),
            "metadata": {"ela": ela_result['score'], "freq": freq_result['score']},
            "integrity_hash": self.security.create_digital_signature(f"{fast_score}"),
            "processing_time": int((time.time() - t0) * 1000),
            "ela_image": ela_result['image'],
            "freq_image": freq_result['image']
        }
        
        self.db.log_scan(result)
        return result

    def analyze_video_tiered(self, video_bytes, max_frames=10):
        # Tier 1
        score_t1 = self._sample_frame(video_bytes, idx=0)
        
        if score_t1 < 35:
            return {"verdict": "AUTHENTIC", "score": score_t1}
        
        # Tier 2: Deep Analysis
        scores = [self._sample_frame(video_bytes, i) for i in range(1, max_frames)]
        return {"verdict": "SUSPICIOUS", "score": np.mean(scores)}

    def _sample_frame(self, video_bytes, idx):
        return 50.0 

    def _ela_analysis(self, image):
        original = image.convert("RGB")
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".jpg") as tmp:
            original.save(tmp.name, "JPEG", quality=90)
            resaved = Image.open(tmp.name).convert("RGB")
        ela = ImageChops.difference(original, resaved)
        extrema = ela.getextrema()
        mx = max([e[1] for e in extrema])
        if mx == 0: mx = 1
        enhanced = ImageEnhance.Brightness(ela).enhance(255.0/mx)
        score = min(100, np.array(enhanced).mean() * 2.5)
        return {"score": score, "image": enhanced}

    def _freq_analysis(self, image):
        gray = np.array(image.convert("L")).astype(float)
        fft = np.fft.fftshift(np.fft.fft2(gray))
        mag = np.log(np.abs(fft)+1e-10)
        mn = (mag-mag.min())/(mag.max()-mag.min()+1e-10)
        score = min(100, mn.mean() * 180)
        return {"score": score, "image": Image.fromarray((mn*255).astype(np.uint8))}
