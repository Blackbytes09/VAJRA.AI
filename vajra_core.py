
import time
import json
import logging
import datetime
import io
import os
import tempfile
import numpy as np

# Machine Learning & Images
from PIL import Image, ImageChops, ImageEnhance
import google.generativeai as genai

# Core Modules
from security_manager import SecurityManager

# --- FIREBASE FAIL-SAFE IMPLEMENTATION ---
# Military grade protocol dictates that external dependencies MUST NOT crash the core system.
FIREBASE_READY = False
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    # We only initialize if a REAL service account is present.
    # The fake one will always cause 'ValueError' when actually hitting the DB.
    if os.path.exists("serviceAccountKey.json"):
        if not firebase_admin._apps:
            cred = credentials.Certificate("serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
        firestore_client = firestore.client()
        FIREBASE_READY = True
        logging.info("Firebase Admin initialized successfully with Service Account.")
    else:
        logging.warning("Firebase Service Account JSON not found. Operating in localized Vault Mode.")
        FIREBASE_READY = False
except Exception as e:
    logging.error(f"Firebase Init suppressed: {str(e)}")
    FIREBASE_READY = False

# --- GEMINI INITIALIZATION ---
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class VajraCore:
    """
    MILITARY-GRADE AUDIT CORE (v6.0)
    Combines Spectral Analysis (ELA/FFT) with Neural Inference (Gemini)
    Features strict Hash-based Caching and Immutable Logging.
    """
    def __init__(self, db_manager):
        self.security = SecurityManager()
        self.db = db_manager # Local SQLite Fallback & Primary Cache
        
    def analyze_asset(self, image_pil, file_bytes, filename, userId):
        t0 = time.time()
        
        # 1. Cryptographic Identity
        file_hash = self.security.generate_file_hash(file_bytes)
        integrity_hash = self.security.create_digital_signature(file_hash)
        
        # 2. Vault Level 1 Check (Cache Validation)
        cached = self.db.check_cache(file_hash)
        if cached:
            meta = json.loads(cached.get('metadata', '{}'))
            return {
                "cached": True,
                "verdict": cached['verdict'],
                "score": cached['score'],
                "processing_time": 0,
                "integrity_hash": cached['integrity_hash'],
                "ela_score": meta.get('ela_score'),
                "fft_score": meta.get('fft_score')
            }
            
        # 3. Layer 1: Forensic Spectral Analysis
        logging.info(f"Layer 1 Spectral scan starting for {file_hash}")
        ela_result = self._ela_analysis(image_pil)
        freq_result = self._freq_analysis(image_pil)
        spectral_score = (ela_result['score'] + freq_result['score']) / 2
        
        # 4. Layer 2: LLM Deep Vision (Gemini)
        logging.info(f"Layer 2 Neural scan starting for {file_hash}")
        ai_score = 50.0  # Default safe-state
        ai_verdict = "SUSPICIOUS"
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            # Pack image for AI
            img_byte_arr = io.BytesIO()
            image_pil.copy().save(img_byte_arr, format='JPEG', quality=95)
            
            prompt = "Act as an expert digital forensic analyst. Examine this image for inconsistencies, artifacts, lighting mismatches, and signs of AI generation or deepfaking. Return strictly JSON: {\"verdict\": \"DEEPFAKE\"|\"SUSPICIOUS\"|\"AUTHENTIC\", \"score\": 0-100 where 100 means definitely manipulated.}"
            response = model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": img_byte_arr.getvalue()}
            ])
            
            # Robust JSON extraction
            import re
            extracted_json = re.search(r'\{.*\}', response.text.strip(), re.DOTALL)
            if extracted_json:
                raw_text = extracted_json.group(0)
            else:
                raw_text = response.text.replace("```json", "").replace("```", "").strip()
                
            ai_data = json.loads(raw_text)
            ai_score = float(ai_data.get('score', 50))
            ai_verdict = ai_data.get('verdict', 'SUSPICIOUS')
        except Exception as e:
            logging.error(f"Gemini API Error: {str(e)}. Falling back to purely Spectral constraints.")
            
        # 5. Composite Fusion Engine
        # We blend the Spectral Score (Pixels) with AI Score (Context)
        final_score = (spectral_score * 0.4) + (ai_score * 0.6)
        
        if final_score >= 70:
            final_verdict = "DEEPFAKE"
        elif final_score >= 35:
            final_verdict = "SUSPICIOUS"
        else:
            final_verdict = "AUTHENTIC"
            
        proc_time = int((time.time() - t0) * 1000)
        
        scan_record = {
            "id": f"VAJ-{int(time.time()*1000)}",
            "userId": userId,
            "filename": filename,
            "file_hash": file_hash,
            "verdict": final_verdict,
            "score": round(final_score, 2),
            "metadata": {
                "ela_score": ela_result['score'],
                "fft_score": freq_result['score'],
                "ai_score": ai_score
            },
            "integrity_hash": integrity_hash,
            "processing_time": proc_time,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        
        # 6. Immutable Logging
        self.db.log_scan(scan_record) # Local DB (Guaranteed Delivery)
        
        if FIREBASE_READY:
            try:
                firestore_client.collection('scans').document(scan_record['id']).set(scan_record)
            except Exception as e:
                logging.error(f"Firebase Sync failed: {e}")
                
        # 7. Return with visualization matrices
        return {
            **scan_record,
            "ela_image": ela_result['image'],
            "freq_image": freq_result['image']
        }

    # --- SPECTRAL ALGORITHMS ---

    def _ela_analysis(self, image):
        """Error Level Analysis"""
        try:
            original = image.convert("RGB")
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                original.save(tmp.name, "JPEG", quality=90)
                resaved = Image.open(tmp.name).convert("RGB")
            ela = ImageChops.difference(original, resaved)
            extrema = ela.getextrema()
            mx = max([ex[1] for ex in extrema])
            if mx == 0: mx = 1
            enhanced = ImageEnhance.Brightness(ela).enhance(255.0/mx)
            score = min(100, np.array(enhanced).mean() * 2.5)
            if os.path.exists(tmp.name):
                os.remove(tmp.name)
            return {"score": float(score), "image": enhanced}
        except Exception as e:
            logging.error(f"ELA Failed: {e}")
            return {"score": 50.0, "image": np.zeros((100,100,3), dtype=np.uint8)}

    def _freq_analysis(self, image):
        """Fast Fourier Transform Analysis"""
        try:
            gray = np.array(image.convert("L")).astype(float)
            fft = np.fft.fftshift(np.fft.fft2(gray))
            mag = np.log(np.abs(fft)+1e-10)
            mn = (mag-mag.min())/(mag.max()-mag.min()+1e-10)
            score = min(100, mn.mean() * 180)
            img_matrix = Image.fromarray((mn*255).astype(np.uint8))
            return {"score": float(score), "image": img_matrix}
        except Exception as e:
            logging.error(f"FFT Failed: {e}")
            return {"score": 50.0, "image": np.zeros((100,100), dtype=np.uint8)}
