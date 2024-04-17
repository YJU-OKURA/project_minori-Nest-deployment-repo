import { SetMetadata } from '@nestjs/common';

export enum Key {
  ROLES = 'roles',
  MODELS = 'models',
}

export const MetaData = <T>(key: Key, models: T) =>
  SetMetadata(key, models);
