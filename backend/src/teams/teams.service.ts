import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './schemas/team.schema';
import { CreateTeamDto, UpdateTeamDto } from './dto/teams.dto';
import { CounterService } from 'src/shared/counter/counter.service';
@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    private readonly counterService: CounterService,
  ) {}
  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const teamId = await this.counterService.getNextSequence('team');
    const newTeam = new this.teamModel({ ...createTeamDto, teamId });
    return newTeam.save();
  }
  async update(teamId: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const updatedTeam = await this.teamModel
      .findOneAndUpdate({ teamId }, { $set: updateTeamDto }, { new: true })
      .exec();

    if (!updatedTeam) {
      throw new NotFoundException(`Team with ID "${teamId}" not found.`);
    }

    return updatedTeam;
  }
  async findOne(teamId: number): Promise<Team> {
    const team = await this.teamModel.findOne({ teamId }).exec();
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    return team.populate('players');
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }
}
