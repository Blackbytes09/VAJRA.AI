import fs from 'fs';
import path from 'path';
import os from 'os';
import { EventEmitter } from 'events';

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed';

export interface Job {
  id: string;
  name: string;
  data: any;
  status: JobStatus;
  progress: number;
  result?: any;
  error?: string;
  timestamp: number;
  attempts: number;
}

/**
 * A persistent task queue that mimics BullMQ but uses a local JSON Write-Ahead Log (WAL)
 * for durability against server crashes.
 */
export class PersistentQueue extends EventEmitter {
  private queue: Map<string, Job> = new Map();
  private walPath: string;
  private name: string;
  private isProcessing: boolean = false;
  private processor?: (job: Job) => Promise<any>;

  constructor(name: string) {
    super();
    this.name = name;
    this.walPath = path.join(os.tmpdir(), `vajra_${name}_queue_wal.json`);
    this.loadWal();
  }

  private loadWal() {
    if (fs.existsSync(this.walPath)) {
      try {
        const raw = fs.readFileSync(this.walPath, 'utf8');
        const jobs: Job[] = JSON.parse(raw);
        for (const job of jobs) {
          // If a job was active during crash, mark it as waiting so it gets retried
          if (job.status === 'active') {
            job.status = 'waiting';
            job.progress = 0;
          }
          this.queue.set(job.id, job);
        }
        console.log(`[Queue:${this.name}] Loaded ${jobs.length} jobs from persistent WAL.`);
      } catch (err) {
        console.error(`[Queue:${this.name}] Failed to load WAL:`, err);
      }
    }
  }

  private saveWal() {
    try {
      const jobs = Array.from(this.queue.values());
      fs.writeFileSync(this.walPath, JSON.stringify(jobs, null, 2), 'utf8');
    } catch (err) {
      console.error(`[Queue:${this.name}] Failed to write WAL:`, err);
    }
  }

  public async add(name: string, data: any): Promise<Job> {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      data,
      status: 'waiting',
      progress: 0,
      timestamp: Date.now(),
      attempts: 0
    };
    
    this.queue.set(job.id, job);
    this.saveWal();
    
    // Trigger processing if not already running
    if (!this.isProcessing) {
      this.processNext();
    }
    
    return job;
  }

  public updateProgress(jobId: string, progress: number, message?: string) {
    const job = this.queue.get(jobId);
    if (!job) return;
    job.progress = progress;
    this.saveWal();
    this.emit('progress', { jobId, progress, message });
  }

  public getJob(jobId: string): Job | undefined {
    return this.queue.get(jobId);
  }

  public process(handler: (job: Job) => Promise<any>) {
    this.processor = handler;
    this.processNext();
  }

  private async processNext() {
    if (this.isProcessing || !this.processor) return;
    
    // Find next waiting job
    let nextJob: Job | undefined;
    for (const job of this.queue.values()) {
      if (job.status === 'waiting') {
        nextJob = job;
        break;
      }
    }

    if (!nextJob) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    nextJob.status = 'active';
    nextJob.attempts += 1;
    this.saveWal();
    this.emit('active', nextJob);

    try {
      const result = await this.processor(nextJob);
      nextJob.status = 'completed';
      nextJob.result = result;
      nextJob.progress = 100;
      this.saveWal();
      this.emit('completed', nextJob);
    } catch (err: any) {
      nextJob.status = 'failed';
      nextJob.error = err.message || String(err);
      this.saveWal();
      this.emit('failed', nextJob);
    } finally {
      this.isProcessing = false;
      // Process next job in queue immediately
      setImmediate(() => this.processNext());
    }
  }
}
