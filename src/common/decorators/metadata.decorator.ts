import { SetMetadata } from '@nestjs/common';

export enum Key {
  ROLES = 'roles',
  MODELS = 'models',
  ID_PARAM = 'id',
}

export const MetaData = <T>(key: Key, models: T) =>
  SetMetadata(key, models);
