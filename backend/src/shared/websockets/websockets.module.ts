import { Module } from '@nestjs/common';
import { CommentaryGateway } from './commentary.gateway';
import { RedisModule } from '../../redis/redis.module';
import { MatchGateway } from './match.gateway';

@Module({
  imports: [RedisModule],
  providers: [CommentaryGateway, MatchGateway],
  exports: [CommentaryGateway, MatchGateway],
})
export class WebSocketsModule {}
