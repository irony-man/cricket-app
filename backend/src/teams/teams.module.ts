import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CounterModule } from 'src/shared/counter/counter.module';
import { Player, PlayerSchema } from 'src/players/schemas/player.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),

    CounterModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
