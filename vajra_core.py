
import time
import torch
import torch.quantization
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from security_manager import SecurityManager
import json
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin
if not firebase_admin._apps:
    # Load config to get project ID
    with open('firebase-applet-config.json', 'r') as f:
        config = json.load(f)
    
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {
        'projectId': config['projectId']
    })
db = firestore.client()

# Initialize Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class VajraCore:
    def __init__(self):
        self.security = SecurityManager()

    def analyze_image(self, image_pil, file_bytes, filename, userId):
        t0 = time.time()
        file_hash = self.security.generate_file_hash(file_bytes)
        
        # 1. AI Analysis (Gemini)
        model = genai.GenerativeModel('gemini-1.5-flash')
        # Convert PIL to bytes for Gemini
        import io
        img_byte_arr = io.BytesIO()
        image_pil.save(img_byte_arr, format='JPEG')
        img_bytes = img_byte_arr.getvalue()
        
        response = model.generate_content([
            "Analyze this image for deepfake signs. Return JSON: {verdict: 'DEEPFAKE'|'SUSPICIOUS'|'AUTHENTIC', score: 0-100}",
            {"mime_type": "image/jpeg", "data": img_bytes}
        ])
        
        analysis = json.loads(response.text)
        
        # 2. Store in Firestore
        scan_data = {
            "userId": userId,
            "filename": filename,
            "verdict": analysis['verdict'],
            "score": analysis['score'],
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        db.collection('scans').add(scan_data)
        
        return {**analysis, "processing_time": int((time.time() - t0) * 1000)}
