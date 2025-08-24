import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchesModule } from './matches/matches.module';
import { RedisModule } from './redis/redis.module';
import { WebSocketsModule } from './shared/websockets/websockets.module';
import { AppConfigModule } from './config/config.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { CommentaryModule } from './commentary/commentary.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MatchesModule,
    RedisModule,
    WebSocketsModule,
    PlayersModule,
    TeamsModule,
    CommentaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
