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
  changeDate: string;
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

export type JummahTime = {
  id: number;
  changeDate: string;
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

export type Masjid = {
  id: number;
  name: string;
  masjidAdhanConfig: AdhanConfig; // Type this once it is available
  subscriptionList: {
    id: number;
    subscriptionType: SubscriptionType;
  }[];
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
  website: string;
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
