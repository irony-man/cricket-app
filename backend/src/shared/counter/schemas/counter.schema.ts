import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Counter extends Document {
  @Prop({ type: String, required: true, unique: true })
  modelName: string;

  @Prop({ type: Number, default: 1000 })
  count: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
