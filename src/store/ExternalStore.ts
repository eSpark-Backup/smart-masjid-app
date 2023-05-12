import { hookstate } from '@hookstate/core';
import { ExternalStoreProps } from '../types';

export const externalStore = hookstate<ExternalStoreProps>({
  countryCodes: [],
});
