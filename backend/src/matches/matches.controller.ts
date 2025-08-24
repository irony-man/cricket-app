import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto, UpdateMatchDto } from './dto/matches.dto';
import { MatchCommentaryDto } from 'src/commentary/dto/commentary.dto';
import { Match } from './schemas/match.schema';
import { Commentary } from 'src/commentary/schemas/commentary.schema';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('start')
  create(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchesService.create(createMatchDto);
  }

  @Post(':id/commentary')
  addCommentary(
    @Param('id', ParseIntPipe) id: number,
    @Body() matchCommentaryDto: MatchCommentaryDto,
  ): Promise<Commentary> {
    return this.matchesService.addCommentary(id, matchCommentaryDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ match: Match; commentary: Commentary[] }> {
    return this.matchesService.findOne(id);
  }

  @Get()
  findAll(): Promise<Match[]> {
    return this.matchesService.findAll();
  }
}
