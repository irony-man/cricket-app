import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match, MatchSchema } from './schemas/match.schema';
import { CounterModule } from 'src/shared/counter/counter.module';
import { TeamsModule } from 'src/teams/teams.module';
import { Team, TeamSchema } from 'src/teams/schemas/team.schema';
import { PlayersModule } from 'src/players/players.module';
import { CommentaryModule } from 'src/commentary/commentary.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
    CounterModule,
    TeamsModule,
    PlayersModule,
    CommentaryModule,
    RedisModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
