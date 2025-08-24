import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/teams.dto';
import { Team } from './schemas/team.schema';
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }
}
