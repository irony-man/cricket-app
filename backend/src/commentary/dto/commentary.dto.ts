import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';
export class MatchCommentaryDto {
  @IsNumber()
  @IsPositive()
  teamId: number;

  @IsNumber()
  @IsPositive()
  striker: number;

  @IsNumber()
  @IsPositive()
  non_striker: number;

  @IsNumber()
  @IsPositive()
  bowler: number;

  @IsNumber()
  @IsPositive()
  inning: number;

  @IsNumber()
  @Min(0)
  over: number;

  @IsNumber()
  @Min(1)
  ball: number;

  @IsString()
  @IsNotEmpty()
  eventType: string;
}

export class CreateCommentaryDto extends MatchCommentaryDto {
  @IsNumber()
  @IsPositive()
  matchId: number;
}

export class UpdateCommentaryhDto extends PartialType(CreateCommentaryDto) {}
