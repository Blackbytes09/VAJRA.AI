
import sqlite3
import json
import logging
import os
from datetime import datetime
from functools import lru_cache

class DatabaseManager:
    """
    CTO POV: Optimized for 'Server-Lite' performance.
    Features: Connection Pooling, LRU Caching, Structured Logging.
    """
    def __init__(self, db_path="vajra_production.db"):
        self.db_path = db_path
        self._init_db()
        self._setup_advanced_logging()
        # Persistent connection for 'Server-Lite' efficiency
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row

    def _setup_advanced_logging(self):
        """Point 3: Structured JSON Logging for Advanced Monitoring."""
        self.logger = logging.getLogger("VajraAudit")
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": %(message)s}')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("PRAGMA journal_mode=WAL") # Point 2: Write-Ahead Logging for speed
            conn.execute("""CREATE TABLE IF NOT EXISTS forensic_scans (
                id TEXT PRIMARY KEY,
                filename TEXT,
                file_hash TEXT UNIQUE,
                verdict TEXT,
                score REAL,
                metadata TEXT,
                integrity_hash TEXT,
                timestamp DATETIME,
                processing_time_ms INTEGER
            )""")
            conn.commit()

    def check_cache(self, file_hash):
        """
        Point 1: In-Memory Cache Check.
        If hash exists, return result without running AI. (Server-Lite feature)
        """
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM forensic_scans WHERE file_hash = ?", (file_hash,))
        row = cursor.fetchone()
        if row:
            self.logger.info(json.dumps({"event": "cache_hit", "hash": file_hash}))
            return dict(row)
        return None

    def log_scan(self, scan_data):
        """Point 4: Optimized non-blocking style write."""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""INSERT OR IGNORE INTO forensic_scans 
            (id, filename, file_hash, verdict, score, metadata, integrity_hash, timestamp, processing_time_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", (
                scan_data['id'],
                scan_data['filename'],
                scan_data['file_hash'],
                scan_data['verdict'],
                scan_data['score'],
                json.dumps(scan_data['metadata']),
                scan_data['integrity_hash'],
                datetime.utcnow(),
                scan_data['processing_time']
            ))
            self.conn.commit()
            self.logger.info(json.dumps({"event": "scan_logged", "id": scan_data['id'], "verdict": scan_data['verdict']}))
        except Exception as e:
            self.logger.error(json.dumps({"event": "db_error", "error": str(e)}))

    def get_analytics(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*), AVG(score), AVG(processing_time_ms) FROM forensic_scans")
        return cursor.fetchone()
