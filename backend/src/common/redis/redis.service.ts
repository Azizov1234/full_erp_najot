import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit {
  private clint: any;
  private fallbackCache = new Map<string, { value: string; expiresAt: number }>();

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const redisOptions = {
      maxRetriesPerRequest: 1,
      retryStrategy(times: number) {
        if (times > 3) {
          return null; // Stop trying to connect to prevent log spam
        }
        return 3000; // Retry after 3 seconds
      },
    };

    if (redisUrl) {
      this.clint = new Redis(redisUrl, redisOptions);
    } else {
      this.clint = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        ...redisOptions,
      });
    }

    this.clint.on("error", (err: any) => {
      console.warn("Redis client connection failed (falling back to in-memory cache):", err.message || err);
    });
  }

  async set(key: string, value: number | string) {
    try {
      if (this.clint && this.clint.status === "ready") {
        await this.clint.set(key, String(value), "EX", 600);
        return;
      }
    } catch (err) {
      console.warn("Failed to set key in Redis, using fallback:", err);
    }
    // In-memory fallback (expires in 10 minutes)
    this.fallbackCache.set(key, {
      value: String(value),
      expiresAt: Date.now() + 600 * 1000,
    });
  }

  async get(key: string) {
    try {
      if (this.clint && this.clint.status === "ready") {
        return await this.clint.get(key);
      }
    } catch (err) {
      console.warn("Failed to get key from Redis, using fallback:", err);
    }
    // In-memory fallback
    const cached = this.fallbackCache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.fallbackCache.delete(key);
      return null;
    }
    return cached.value;
  }

  async del(key: string) {
    try {
      if (this.clint && this.clint.status === "ready") {
        await this.clint.del(key);
        return;
      }
    } catch (err) {
      console.warn("Failed to delete key from Redis, using fallback:", err);
    }
    this.fallbackCache.delete(key);
  }
}
