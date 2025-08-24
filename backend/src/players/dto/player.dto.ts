import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsArray,
} from 'class-validator';
import { PlayerRole } from '../constants/players.enum';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  short_name: string;

  @IsOptional()
  @IsIn(Object.values(PlayerRole))
  role: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  teams: number[];
}

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
