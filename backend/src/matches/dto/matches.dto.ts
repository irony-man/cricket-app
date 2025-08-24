import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { MatchStatus, TossDecision } from '../constants/matches.enum';

class CreateTossDto {
  @IsNumber()
  winner: number;

  @IsEnum(TossDecision)
  decision: TossDecision;
}

export class CreateMatchDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  teams: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTossDto)
  toss?: CreateTossDto;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
