import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commentary, CommentarySchema } from './schemas/commentary.schema';
import { CommentaryController } from './commentary.controller';
import { CommentaryService } from './commentary.service';
import { Match, MatchSchema } from 'src/matches/schemas/match.schema';
import { Team, TeamSchema } from 'src/teams/schemas/team.schema';
import { Player, PlayerSchema } from 'src/players/schemas/player.schema';
import { RedisModule } from 'src/redis/redis.module';
import { CounterModule } from 'src/shared/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commentary.name, schema: CommentarySchema },
      { name: Match.name, schema: MatchSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
    RedisModule,
    CounterModule,
  ],
  controllers: [CommentaryController],
  providers: [CommentaryService],
  exports: [CommentaryService],
})
export class CommentaryModule {}
