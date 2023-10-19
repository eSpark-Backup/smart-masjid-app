import { DStatus } from '.';

export interface Device {
  id: number;
  macAddress: string;
  deviceType: {
    id: number;
    deviceCategory: {
      id: number;
      name: string;
    };
    name: string;
    manufacturer: string;
    modelNumber: string;
  };
  deviceTelemetry: {
    id: number;
    status: DStatus;
    batteryLife: number;
    updatedTime: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  masjid: {
    id: number;
    name: string;
    masjidAdhanConfig: {
      id: number;
      adhanCalcConfig: {
        id: number;
        name: string;
      };
      adhanJuristicConfig: {
        id: number;
        name: string;
      };
      adhanCustomConfig: {
        id: number;
        name: string;
        fajrAngle: number;
        maghribRule: string;
        maghribValue: string;
        ishaRule: string;
        ishaValue: string;
      };
      createdBy: string;
      createdDate: string;
      updatedBy: string;
      updatedDate: string;
    };
    subscriptionList: {
      id: number;
      subscriptionType: {
        id: number;
        subscriptionCategory: {
          id: number;
          name: string;
        };
        name: string;
        topic: string;
      };
    }[];
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    phone: string;
    website: string;
    timezone: string;
    location: {
      type: string;
      coordinates: number[];
    };
    elevation: number;
    adhanStreamUrl: string;
    status: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
  };
  subscriptions: {
    id: number;
    subscriptionType: {
      id: number;
      subscriptionCategory: {
        id: number;
        name: string;
      };
      name: string;
      topic: string;
    };
  }[];
  name: string;
  wifiSsid: string;
  firmwareVersion: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}
