import { SetMetadata } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const KEY_OF_MODELS = 'models';

export const Models = (models: Prisma.ModelName) =>
  SetMetadata(KEY_OF_MODELS, models);
