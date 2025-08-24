import { SchemaOptions } from '@nestjs/mongoose';

export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc: unknown, ret: Record<string, unknown>) => {
      delete ret.id;
      delete ret._id;
      delete ret.__v;
    },
  },
};
