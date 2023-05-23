import { Device } from './deviceControllerTypes';
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
  currentRegisterUser: UserResponse | null;
  token: UserResponse | null;
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

export type DeviceStoreProps = {
  devices: Device[];
};

export type ExternalStoreProps = {
  countryCodes: CountryCodes[];
};

export type CountryCodes = {
  id: number;
  country: string;
  code: string;
  enabled: boolean;
  iso_code: string;
};

export type DeviceInfo = {
  macId?: string;
  nickName?: string;
  ssid?: string;
  password?: string;
  device_model?: string;
  mac_address?: string;
  firmware_rev?: string;
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
