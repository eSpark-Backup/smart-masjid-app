import { hookstate } from '@hookstate/core';
import { MasjidStoreProps } from '../types';

export const masjidStore = hookstate<MasjidStoreProps>({
  adhanConfig: null,
  iqamahTime: null,
});
