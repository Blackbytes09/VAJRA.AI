
import hashlib
import hmac
import jwt
import datetime
import os
from cryptography.fernet import Fernet

# CTO Note: Using a secret key for Hashing and JWT
SECRET_KEY = os.environ.get("VAJRA_SECRET_KEY", "vajra_super_secret_key_123")

class SecurityManager:
    @staticmethod
    def generate_file_hash(file_bytes):
        """
        Point 7: Compliance - SHA-256 Hashing for Data Integrity.
        Ensures the report cannot be tampered with.
        """
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def create_digital_signature(data_string):
        """Creates a HMAC signature for forensic reports."""
        return hmac.new(SECRET_KEY.encode(), data_string.encode(), hashlib.sha256).hexdigest()

    @staticmethod
    def verify_integrity(data_string, signature):
        """Verifies if the data has been modified."""
        expected = SecurityManager.create_digital_signature(data_string)
        return hmac.compare_digest(expected, signature)

    @staticmethod
    def create_session_token(user_id):
        """Point 5: Security - JWT based session management."""
        payload = {
            "user_id": user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
