/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { CreateMatchDto, UpdateMatchDto } from './dto/matches.dto';
import { CounterService } from 'src/shared/counter/counter.service';
import { Team } from 'src/teams/schemas/team.schema';
import { PlayersService } from 'src/players/players.service';
import {
  CreateCommentaryDto,
  MatchCommentaryDto,
} from 'src/commentary/dto/commentary.dto';
import { Commentary } from 'src/commentary/schemas/commentary.schema';
import { CommentaryService } from 'src/commentary/commentary.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    private readonly playerService: PlayersService,
    private readonly counterService: CounterService,
    private readonly commentaryService: CommentaryService,
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const { teams: teamIds, toss, ...matchDetails } = createMatchDto;

    const matchId = await this.counterService.getNextSequence('match');

    const teams = await this.playerService.findTeamsByTeamIds(teamIds);
    const teamObjectIds = teams.map((team) => team._id);

    const newMatchPayload: any = {
      ...matchDetails,
      teams: teamObjectIds,
      matchId,
    };

    if (toss) {
      const tossWinnerTeam = teams.find((t) => t.teamId === toss.winner);
      if (!tossWinnerTeam) {
        throw new BadRequestException(
          `Toss winner with teamId "${toss.winner}" is not one of the playing teams.`,
        );
      }
      newMatchPayload.toss = {
        winner: tossWinnerTeam._id,
        decision: toss.decision,
      };
    }

    const newMatch = new this.matchModel(newMatchPayload);
    const savedMatch = await newMatch.save();
    return (await savedMatch.populate('toss.winner')).populate('teams');
  }

  async update(
    matchId: number,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const { teams: teamIds, toss, ...matchDetails } = updateMatchDto;

    const updatePayload: any = { ...matchDetails };

    if (teamIds) {
      const teams = await this.playerService.findTeamsByTeamIds(teamIds);
      updatePayload.teams = teams.map((team) => team._id);
    }

    if (toss) {
      const tossWinnerTeam = await this.teamModel
        .findOne({ teamId: toss.winner })
        .exec();
      if (!tossWinnerTeam) {
        throw new BadRequestException(
          `Toss winner with teamId "${toss.winner}" does not exist.`,
        );
      }
      updatePayload.toss = {
        winner: tossWinnerTeam._id,
        decision: toss.decision,
      };
    }

    const updatedMatch = await this.matchModel
      .findOneAndUpdate({ matchId }, { $set: updatePayload }, { new: true })
      .populate('teams')
      .populate('toss.winner')
      .exec();

    if (!updatedMatch) {
      throw new NotFoundException(`Match with ID "${matchId}" not found.`);
    }

    return updatedMatch;
  }

  async addCommentary(
    matchId: number,
    matchCommentaryDto: MatchCommentaryDto,
  ): Promise<Commentary> {
    const createCommentaryDto: CreateCommentaryDto = {
      ...matchCommentaryDto,
      matchId,
    };
    return this.commentaryService.create(createCommentaryDto);
  }

  async findOne(
    matchId: number,
  ): Promise<{ match: Match; commentary: Commentary[] }> {
    const match = await this.matchModel
      .findOne({ matchId })
      .populate([
        { path: 'toss.winner' },
        {
          path: 'teams',
          populate: {
            path: 'players',
          },
        },
      ])
      .exec();
    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }
    const commentary =
      await this.commentaryService.findRecentByMatchId(matchId);
    const response = { match, commentary: commentary };
    return response;
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel
      .find()
      .populate('teams')
      .populate('toss.winner')
      .exec();
  }
}
