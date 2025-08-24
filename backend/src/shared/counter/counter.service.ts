import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './schemas/counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
  ) {}

  async getNextSequence(modelIdentifier: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { modelName: modelIdentifier },
      {
        $inc: { count: 1 },
      },
      { new: true, upsert: true },
    );
    return counter.count;
  }
}
