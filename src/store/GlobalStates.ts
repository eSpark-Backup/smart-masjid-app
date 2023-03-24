import { hookstate } from '@hookstate/core';

export const globalStore = hookstate({
  deviceId: null,
});
