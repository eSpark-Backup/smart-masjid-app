import { hookstate } from '@hookstate/core';
import { MasjidStoreProps } from '../types';

export const masjidStore = hookstate<MasjidStoreProps>({
  adhanConfig: null,
  adhanTimings: [],
  iqamahTime: null,
  masjid: null,
  masjidsJummaSubs: null,
  iqamahHistory: [],
  JummahTime: null,
  JummahHistory: [],
  userMasjidList: null,
  connectedDevices: [],
});
