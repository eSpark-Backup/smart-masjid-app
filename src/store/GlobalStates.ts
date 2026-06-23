import { hookstate } from '@hookstate/core';
import { GlobalProps } from '../types';

export const globalStore = hookstate<GlobalProps>({
  phoneId: null,
  fcmToken: null,
  isDeviceRegistered: false,
  devSetup: false,
  globalLoading: false,
  hideNetError: false,
  globalLoadingMsg: '',
  countryCode: null,
});
