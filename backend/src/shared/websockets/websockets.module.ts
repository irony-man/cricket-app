import { Module } from '@nestjs/common';
import { CommentaryGateway } from './commentary.gateway';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CommentaryGateway],
  exports: [CommentaryGateway],
})
export class WebSocketsModule {}
