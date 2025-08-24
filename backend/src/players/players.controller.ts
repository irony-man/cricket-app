import {
  Controller,
  Post,
  Body,
  Get,
  ParseIntPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/player.dto';
import { Player } from './schemas/player.schema';
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Player> {
    return this.playersService.findOne(id);
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }
}
