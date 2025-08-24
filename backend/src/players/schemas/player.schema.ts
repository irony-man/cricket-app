import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PlayerRole } from '../constants/players.enum';
import { Team } from 'src/teams/schemas/team.schema';
import { defaultSchemaOptions } from 'src/shared/database/schema.options';

@Schema(defaultSchemaOptions)
export class Player extends Document {
  @Prop({ required: true, unique: true })
  playerId: number;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  short_name: string;

  @Prop({
    required: true,
    enum: PlayerRole,
    default: PlayerRole.BATSMAN,
  })
  role: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Team' }] })
  teams: Team[];
}
export const PlayerSchema = SchemaFactory.createForClass(Player);
