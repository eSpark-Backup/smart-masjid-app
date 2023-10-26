import { Device } from './deviceControllerTypes';
import {
  AdhanConfig,
  AdhanTime,
  IqamahTime,
  JummahTime,
  Masjid,
  SalahTimings,
  subJummas,
} from './masjidControllerTypes';
import {
  FailCheckPhoneId,
  SuccessCheckPhoneId,
  UserResponse,
  UserType,
} from './userControllerApiResponse';

export type RootStackParamList = {
  Welcome: undefined;
  USetup?: { type?: 'login' | 'setup' };
  DSetup?: {
    from?: string;
    deviceData?: Device;
    onlyPassword?: boolean;
    isBtn?: boolean;
  };
  HomeBottomTab: undefined;
};

export type BottomNavigationParamList = {
  Home: { masjidId?: string } | undefined;
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
  userRoles: UserType[];
};

export type MasjidStoreProps = {
  adhanConfig: AdhanConfig | null;
  adhanTimings: AdhanTime[];
  iqamahTime: IqamahTime[] | null;
  masjid: Masjid | null;
  masjidsJummaSubs: subJummas | null;
  iqamahHistory: IqamahTime[];
  JummahTime: JummahTime | null;
  JummahHistory: JummahTime[];
  userMasjidList: Masjid[] | null;
  connectedDevices: Device[];
  salahTimings: SalahTimings[];
};

export type DeviceStoreProps = {
  devices: Device[];
  masjidDevices: Device[];
};

export type HelpStoreProps = {
  FAQs: FAQ[];
  reasons: FAQ[];
};

export type ExternalStoreProps = {
  countryCodes: CountryCodes[];
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: string;
};

export type CountryCodes = {
  id: number;
  country: string;
  code: string;
  enabled: boolean;
  iso_code: string;
};

export type PhoneIdResponse =
  | SuccessCheckPhoneId
  | FailCheckPhoneId
  | undefined;

export type DeviceInfo = {
  macId?: string;
  nickName?: string;
  ssid?: string;
  password?: string;
  device_model?: string;
  mac_address?: string;
  firmware_rev?: string;
};

export interface SalahInfo {
  name: string;
  adhanTime: string;
  iqamaTime: string;
}
export interface IPrayerTimeForPeriod {
  date: string;
  salah: SalahInfo[];
}
export interface supportRequestData {
  reasonId: number;
  problem: string;
  userId: string;
}
