import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CommentaryService } from './commentary.service';

@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Get('match/:matchId')
  findByMatchId(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.commentaryService.findByMatchId(matchId);
  }

  @Get('match/:matchId/recent')
  findRecentByMatchId(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.commentaryService.findRecentByMatchId(matchId);
  }
}
