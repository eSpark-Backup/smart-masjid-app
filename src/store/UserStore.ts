import { hookstate } from '@hookstate/core';
import { UserStoreProps } from '../types';

export const userStore = hookstate<UserStoreProps>({
  userData: null,
  masjidAdmins: [],
  token: null,
  currentRegisterUser: null,
  userRoles: [],
  monthlySchedule: null,
});
