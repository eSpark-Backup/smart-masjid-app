import { hookstate } from '@hookstate/core';
import { DeviceStoreProps } from '../types';

export const deviceStore = hookstate<DeviceStoreProps>({
  devices: [],
  masjidDevices: [],
});
