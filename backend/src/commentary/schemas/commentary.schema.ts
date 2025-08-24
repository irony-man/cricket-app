import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { defaultSchemaOptions } from 'src/shared/database/schema.options';
import { Match } from 'src/matches/schemas/match.schema';
import { Team } from 'src/teams/schemas/team.schema';
import { Player } from 'src/players/schemas/player.schema';

@Schema(defaultSchemaOptions)
export class Commentary extends Document {
  @Prop({ required: true, unique: true })
  commentaryId: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Match' })
  match: Match;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Team' })
  team: Team;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Player' })
  striker: Player;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Player' })
  non_striker: Player;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Player' })
  bowler: Player;

  @Prop({ required: true })
  inning: number;

  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ required: true })
  eventType: string;
}
export const CommentarySchema = SchemaFactory.createForClass(Commentary);
