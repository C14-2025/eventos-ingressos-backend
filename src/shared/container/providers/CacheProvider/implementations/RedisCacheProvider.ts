import { cacheConfig } from '@config/cache';
import Redis, { RedisOptions } from 'ioredis';
import { ICacheProvider } from '../models/ICacheProvider';

export class RedisCacheProvider implements ICacheProvider {
  private client: Redis | null = null;
  private connected = false;

  public constructor() {
    try {
      this.client = new Redis(cacheConfig.config.redis as RedisOptions);

      this.client.on('connect', () => {
        this.connected = true;
        console.log('✅ Redis conectado com sucesso!');
      });

      this.client.on('error', (err) => {
        this.connected = false;
        console.warn('⚠️  Redis indisponível, continuando sem cache:', err.message);
      });
    } catch (error) {
      console.warn('⚠️  Falha ao inicializar Redis:', (error as Error).message);
      this.client = null;
    }
  }

  public async save<T>(key: string, value: T): Promise<void> {
    if (!this.connected || !this.client) return;
    await this.client.set(key, JSON.stringify(value));
  }

  public async recovery<T>(key: string): Promise<T | null> {
    if (!this.connected || !this.client) return null;

    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  public async invalidate(key: string): Promise<void> {
    if (!this.connected || !this.client) return;
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    if (!this.connected || !this.client) return;

    const keys = await this.client.keys(
      `${cacheConfig.config.redis.keyPrefix}${prefix}:*`,
    );

    if (keys.length === 0) return;

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key.replace(cacheConfig.config.redis.keyPrefix, ''));
    });

    await pipeline.exec();
  }
}
