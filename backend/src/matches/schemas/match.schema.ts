import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MatchStatus, TossDecision } from '../constants/matches.enum';
import { defaultSchemaOptions } from 'src/shared/database/schema.options';
import { Team } from 'src/teams/schemas/team.schema';

@Schema({ _id: false })
class Toss {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Team' })
  winner: Team;

  @Prop({ required: true, enum: TossDecision })
  decision: TossDecision;
}
const TossSchema = SchemaFactory.createForClass(Toss);

@Schema(defaultSchemaOptions)
export class Match extends Document {
  @Prop({ required: true, unique: true })
  matchId: number;

  @Prop({
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Team' }],
    validate: {
      validator: (v: Team[]) => v.length === 2,
      message: () => `There must be exactly two teams playing in the match.`,
    },
  })
  teams: Team[];

  @Prop({ type: TossSchema })
  toss: Toss;

  @Prop({
    type: String,
    enum: MatchStatus,
    default: MatchStatus.ONGOING,
  })
  status: MatchStatus;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
