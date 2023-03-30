import { hookstate } from '@hookstate/core';
import { GlobalProps } from '../types';

export const globalStore = hookstate<GlobalProps>({
  phoneId: null,
  fcmToken: 'fcmToken'
});
