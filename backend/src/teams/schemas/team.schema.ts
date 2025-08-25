import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Player } from 'src/players/schemas/player.schema';
import { defaultSchemaOptions } from 'src/shared/database/schema.options';

@Schema(defaultSchemaOptions)
export class Team extends Document {
  @Prop({ required: true, unique: true })
  teamId: number;

  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  short_name: string;

  players: Player[];
}
export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.virtual('players', {
  ref: 'Player',
  localField: '_id',
  foreignField: 'teams',
});
