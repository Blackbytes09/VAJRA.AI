import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;  // We only store the prefix and a salted hash of the key
  keyHash: string;
  createdAt: number;
  lastUsedAt?: number;
  status: 'active' | 'revoked';
}

export class ApiKeyService {
  private dbPath: string;
  private keys: Map<string, ApiKey> = new Map();

  constructor() {
    this.dbPath = path.join(os.tmpdir(), "vajra_api_keys.json");
    this.loadDb();
  }

  private loadDb() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        const items: ApiKey[] = JSON.parse(raw);
        for (const item of items) {
          this.keys.set(item.id, item);
        }
      } catch (err) {
        console.error("Failed to load API keys database", err);
      }
    }
  }

  private saveDb() {
    try {
      const items = Array.from(this.keys.values());
      fs.writeFileSync(this.dbPath, JSON.stringify(items, null, 2), 'utf8');
    } catch (err) {
      console.error("Failed to save API keys database", err);
    }
  }

  // Hashes the key for secure storage (we never store the plain key)
  private hashKey(plainKey: string): string {
    return crypto.createHash('sha256').update(plainKey).digest('hex');
  }

  /**
   * Generates a new API key. Returns the plaintext key ONLY ONCE.
   */
  public generateKey(name: string): { plaintext: string; keyInfo: ApiKey } {
    const rawValue = crypto.randomBytes(32).toString('hex');
    const plaintext = `vajra_${rawValue}`;
    
    // We only store the first 8 characters of the actual random part for display
    const keyPrefix = `vajra_${rawValue.substring(0, 8)}...`;
    
    const keyInfo: ApiKey = {
      id: crypto.randomUUID(),
      name,
      keyPrefix,
      keyHash: this.hashKey(plaintext),
      createdAt: Date.now(),
      status: 'active'
    };
    
    this.keys.set(keyInfo.id, keyInfo);
    this.saveDb();
    
    return { plaintext, keyInfo };
  }

  public listKeys(): ApiKey[] {
    return Array.from(this.keys.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  public revokeKey(id: string): boolean {
    const key = this.keys.get(id);
    if (!key) return false;
    key.status = 'revoked';
    this.saveDb();
    return true;
  }

  public validateKey(plaintext: string): boolean {
    const hash = this.hashKey(plaintext);
    for (const key of this.keys.values()) {
      if (key.keyHash === hash && key.status === 'active') {
        key.lastUsedAt = Date.now();
        this.saveDb();
        return true;
      }
    }
    return false;
  }
}

export const apiKeyService = new ApiKeyService();
