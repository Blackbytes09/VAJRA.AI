
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
    # Load config
    with open('firebase-applet-config.json', 'r') as f:
        config = json.load(f)
    
    # Create a dummy service account dict from config
    # Note: In production, you should use a real service account JSON file
    cred_dict = {
        "type": "service_account",
        "project_id": config['projectId'],
        "private_key_id": "none",
        "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
        "client_email": "admin@" + config['projectId'] + ".iam.gserviceaccount.com",
        "client_id": "none",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/" + config['projectId'] + ".iam.gserviceaccount.com"
    }
    
    cred = credentials.Certificate(cred_dict)
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
