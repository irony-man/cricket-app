import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Player } from './schemas/player.schema';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/player.dto';
import { CounterService } from 'src/shared/counter/counter.service';
import { Team } from 'src/teams/schemas/team.schema';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    private readonly counterService: CounterService,
  ) {}

  public async findTeamsByTeamIds(teamIds: number[]): Promise<Team[]> {
    const teams = await this.teamModel
      .find({ teamId: { $in: teamIds } })
      .exec();
    if (teams.length !== teamIds.length) {
      throw new BadRequestException(
        'One or more teamIds are invalid or do not exist.',
      );
    }
    return teams;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { teams: teamIds, ...playerDetails } = createPlayerDto;

    const playerId = await this.counterService.getNextSequence('player');

    let teamObjectIds: MongooseSchema.Types.ObjectId[] = [];
    if (teamIds && teamIds.length > 0) {
      const teams = await this.findTeamsByTeamIds(teamIds);
      teamObjectIds = teams.map(
        (team) => team._id as MongooseSchema.Types.ObjectId,
      );
    }

    const newPlayer = new this.playerModel({
      ...playerDetails,
      teams: teamObjectIds,
      playerId,
    });
    return (await newPlayer.save()).populate('teams');
  }

  async update(
    playerId: number,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const { teams: teamIds, ...playerDetails } = updatePlayerDto;

    const updatePayload: any = { ...playerDetails };

    if (teamIds) {
      const teams = await this.findTeamsByTeamIds(teamIds);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updatePayload.teams = teams.map(
        (team) => team._id as MongooseSchema.Types.ObjectId,
      );
    }

    const updatedPlayer = await this.playerModel
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .findOneAndUpdate({ playerId }, { $set: updatePayload }, { new: true })
      .populate('teams')
      .exec();

    if (!updatedPlayer) {
      throw new NotFoundException(`Player with ID "${playerId}" not found.`);
    }

    return updatedPlayer;
  }

  async findOne(playerId: number): Promise<Player> {
    const player = await this.playerModel
      .findOne({ playerId })
      .populate('teams')
      .exec();
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }
    return player;
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().populate('teams').exec();
  }
}
