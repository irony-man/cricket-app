import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  short_name: string;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
