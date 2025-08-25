/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commentary } from './schemas/commentary.schema';
import { CreateCommentaryDto } from './dto/commentary.dto';
import { Match } from 'src/matches/schemas/match.schema';
import { Team } from 'src/teams/schemas/team.schema';
import { Player } from 'src/players/schemas/player.schema';
import { RedisService } from 'src/redis/redis.service';
import { CounterService } from 'src/shared/counter/counter.service';

@Injectable()
export class CommentaryService {
  private readonly COMMENTARY_CACHE_KEY = (matchId: number) =>
    `match:${matchId}:commentary`;
  private readonly COMMENTARY_CACHE_SIZE = 10;

  constructor(
    @InjectModel(Commentary.name)
    private readonly commentaryModel: Model<Commentary>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    private readonly redisService: RedisService,
    private readonly counterService: CounterService,
  ) {}

  async create(createCommentaryDto: CreateCommentaryDto): Promise<Commentary> {
    const {
      matchId,
      team: teamId,
      striker,
      non_striker,
      bowler,
      ...details
    } = createCommentaryDto;

    const [match, team, players] = await Promise.all([
      this.matchModel.findOne({ matchId }).populate('teams').exec(),
      this.teamModel.findOne({ teamId }).exec(),
      this.playerModel
        .find({ playerId: { $in: [striker, non_striker, bowler] } })
        .populate('teams')
        .exec(),
    ]);

    if (!match)
      throw new NotFoundException(`Match with ID ${matchId} not found.`);
    if (!team) throw new NotFoundException(`Team with ID ${teamId} not found.`);

    const foundPlayerIds = players.map((p) => p.playerId);
    const missingPlayerIds = [striker, non_striker, bowler].filter(
      (id) => !foundPlayerIds.includes(id),
    );
    if (missingPlayerIds.length > 0) {
      throw new BadRequestException(
        `Players with the following IDs could not be found: ${missingPlayerIds.join(', ')}`,
      );
    }

    const matchTeamIds = (match.teams as Team[]).map((t) => t.teamId);
    if (!matchTeamIds.includes(teamId)) {
      throw new BadRequestException(
        `Team with ID ${teamId} is not part of match ${matchId}.`,
      );
    }

    players.forEach((p) => {
      const playerTeamIds = (p.teams as Team[]).map((t) => t.teamId);
      if (!playerTeamIds.some((ptId) => matchTeamIds.includes(ptId))) {
        throw new BadRequestException(
          `Player with ID ${p.playerId} is not part of a team in this match.`,
        );
      }
    });

    const strikerDoc = players.find((p) => p.playerId === striker);
    const nonStrikerDoc = players.find((p) => p.playerId === non_striker);
    const bowlerDoc = players.find((p) => p.playerId === bowler);

    const commentaryId =
      await this.counterService.getNextSequence('commentary');
    const newCommentary = new this.commentaryModel({
      commentaryId,
      match: match._id,
      ...details,
      team: team._id,
      striker: strikerDoc?._id,
      non_striker: nonStrikerDoc?._id,
      bowler: bowlerDoc?._id,
    });

    const savedCommentary = await (
      await newCommentary.save()
    ).populate(['match', 'team', 'striker', 'non_striker', 'bowler']);

    const redisPublisher = this.redisService.getPublisher();
    const cacheKey = this.COMMENTARY_CACHE_KEY(matchId);
    const payload = { ...savedCommentary.toJSON(), matchId };

    await redisPublisher.lPush(cacheKey, JSON.stringify(payload));
    await redisPublisher.lTrim(cacheKey, 0, this.COMMENTARY_CACHE_SIZE - 1);
    void redisPublisher.publish('commentary-updates', JSON.stringify(payload));

    return savedCommentary;
  }

  async findByMatchId(matchId: number): Promise<Commentary[]> {
    const match = await this.matchModel.findOne({ matchId }).exec();
    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found.`);
    }
    const commentaries = await this.commentaryModel
      .find({ match: match._id })
      .populate(['team', 'striker', 'non_striker', 'bowler', 'match'])
      .sort({ createdAt: -1 })
      .exec();

    if (commentaries && commentaries.length) {
      const redisPublisher = this.redisService.getPublisher();
      const cacheKey = this.COMMENTARY_CACHE_KEY(matchId);
      await redisPublisher.del(cacheKey);

      await redisPublisher.rPush(
        cacheKey,
        commentaries.map((c) => JSON.stringify({ ...c.toJSON(), matchId })),
      );
      await redisPublisher.lTrim(cacheKey, 0, this.COMMENTARY_CACHE_SIZE - 1);
    }

    return commentaries;
  }

  async findRecentByMatchId(matchId: number): Promise<any[]> {
    const redisClient = this.redisService.getPublisher();
    const cacheKey = this.COMMENTARY_CACHE_KEY(matchId);
    const cachedData = await redisClient.lRange(cacheKey, 0, -1);
    if (!cachedData || cachedData.length === 0) {
      return await this.findByMatchId(matchId);
    }
    return cachedData.map((item) => JSON.parse(item));
  }
}
