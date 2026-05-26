import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { REDIS_CLIENT } from 'src/shared/constants/redis.constants';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.redis.on('ready', () => {
      this.logger.log('Redis connection is ready');
    });

    this.redis.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err}`);
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis connection closed, retrying...');
    });
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (!this.redis.status || this.redis.status !== 'ready') {
        throw new Error('Redis client not ready');
      }
      if (ttlSeconds) {
        await this.redis.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.redis.set(key, value);
      }
    } catch (err) {
      this.logger.error(`Redis SET failed for ${key}: ${err}`);
      throw new InternalServerErrorException('Redis set failed');
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.redis.status || this.redis.status !== 'ready') {
        throw new Error('Redis client not ready');
      }
      return await this.redis.get(key);
    } catch (err) {
      this.logger.error(`Redis GET failed for ${key}: ${err}`);
      throw new InternalServerErrorException('Redis get failed');
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (err) {
      this.logger.error(`Redis DEL failed for ${key}: ${err}`);
      throw new InternalServerErrorException('Redis del failed');
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (err) {
      this.logger.error(`Redis TTL failed for ${key}: ${err}`);
      throw new InternalServerErrorException('Redis TTL failed');
    }
  }

  async incr(key: string, ttlSeconds?: number): Promise<number> {
    try {
      const result = await this.redis.incr(key);
      if (result === 1 && ttlSeconds) {
        await this.redis.expire(key, ttlSeconds);
      }
      return result;
    } catch (err) {
      this.logger.error(`Redis INCR failed for ${key}: ${err}`);
      throw new InternalServerErrorException('Redis incr failed');
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.redis.expire(key, seconds);
    } catch (err) {
      this.logger.error(`Redis EXPIRE failed for ${key}: ${err}`);
      throw new InternalServerErrorException('Redis expire failed');
    }
  }
}
