import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { CounterModule } from 'src/shared/counter/counter.module';
import { Team, TeamSchema } from 'src/teams/schemas/team.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
    CounterModule,
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
