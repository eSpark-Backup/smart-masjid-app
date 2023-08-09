type AdhanCalcConfig = {
  id: number;
  name: string;
};

type AdhanJuristicConfig = {
  id: number;
  name: string;
};

type AdhanCustomConfig = {
  id: number;
  name: string;
  fajrAngle: number;
  maghribRule: string;
  maghribValue: string;
  ishaRule: string;
  ishaValue: string;
};

export type AdhanConfig = {
  id: number;
  adhanCalcConfig: AdhanCalcConfig;
  adhanJuristicConfig: AdhanJuristicConfig;
  adhanCustomConfig: AdhanCustomConfig;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
};

export type IqamahTime = {
  id?: number;
  type: string;
  effectiveDate: string;
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  isha?: string;
  fajrDelay?: number | null;
  dhuhrDelay?: number | null;
  maghribDelay?: number | null;
  ishaDelay?: number | null;
  createdBy?: string;
  createdDate?: string;
  asrDelay?: number | null;
};

export type PrayerTimes = {
  asr: string;
  date: string;
  dhuhr: string;
  fajr: string;
  id: number;
  isha: string;
  maghrib: string;
  sunrise: string;
  updatedDate: null;
};

export type JummahTime = {
  id: number;
  effectiveDate: string;
  createdBy: string;
  createdDate: string;
} & {
  [key: `jumuah${number}`]: string;
};

type SubscriptionCategory = {
  id: number;
  name: string;
};

type SubscriptionType = {
  id: number;
  subscriptionCategory: SubscriptionCategory;
  name: string;
  topic: string;
};

type Location = {
  type: string;
  coordinates: number[];
};

export type SubscriptionList = {
  id: number;
  subscriptionType: SubscriptionType;
};

export type Masjid = {
  id: number;
  name: string;
  masjidAdhanConfig: AdhanConfig; // Type this once it is available
  subscriptionList: SubscriptionList[];
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
  timezone: string;
  location: Location;
  elevation: number;
  adhanStreamUrl: string;
  status: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string | null;
  updatedDate: string | null;
};


export interface Salah {
  name: string;
  adhanTime: string;
  iqamaTime: string;
}

export interface SalahTimings {
  date: string;
  salah: Salah[];
}