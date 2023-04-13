import {
  AdhanConfig,
  IqamahTime,
  JummahTime,
  Masjid,
} from './masjidControllerTypes';
import { UserResponse } from './userControllerApiResponse';

export type RootStackParamList = {
  Welcome: undefined;
  USetup?: { type?: 'login' | 'setup' };
  DSetup?: { from?: string };
  HomeBottomTab: undefined;
};

export type BottomNavigationParamList = {
  Home: undefined;
  Search: undefined;
  Device?: { from?: string };
  Profile: undefined;
};

export type GlobalProps = {
  phoneId?: string | null;
  fcmToken?: string;
  isDeviceRegistered?: boolean;
};

export type UserStoreProps = {
  userData: UserResponse | null;
  masjidAdmins: UserResponse[];
};

export type MasjidStoreProps = {
  adhanConfig: AdhanConfig | null;
  iqamahTime: IqamahTime | null;
  masjid: Masjid | null;
  iqamahHistory: IqamahTime[];
  JummahTime: JummahTime | null;
  JummahHistory: JummahTime[];
};

export interface IPrayerTimeForPeriod {
  id: number;
  date: string;
  fajr: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  dhuhr: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  asr: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  maghrib: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  isha: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  updatedDate: string;
  fajrCalled: boolean;
  dhuhrCalled: boolean;
  asrCalled: boolean;
  maghribCalled: boolean;
  ishaCalled: boolean;
}
