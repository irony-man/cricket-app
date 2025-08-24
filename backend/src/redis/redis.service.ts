import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private publisher: RedisClientType;
  private subscriber: RedisClientType;

  async onModuleInit() {
    this.publisher = createClient({ url: 'redis://localhost:6379' });
    this.subscriber = this.publisher.duplicate();
    await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
  }

  async onModuleDestroy() {
    await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
  }

  getPublisher(): RedisClientType {
    return this.publisher;
  }

  getSubscriber(): RedisClientType {
    return this.subscriber;
  }
}
