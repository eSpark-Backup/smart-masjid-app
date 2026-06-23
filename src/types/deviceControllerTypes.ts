import { DStatus } from '.';

export type DeviceTypesType = {
  id: number;
  deviceCategory: DeviceCatType;
  name: string;
  manufacturer: string;
  modelNumber: string;
};
export type DeviceCatType = {
  id: number;
  name: string;
};
export interface Device {
  id: number;
  ipAddress: string;
  macAddress: string;
  deviceType: DeviceTypesType;
  deviceTelemetry: {
    id: number;
    status: DStatus;
    streamer: string;
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

export interface DeviceLogType {
  id: number;
  version: string;
  status: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}
export interface DeviceFirmwareType {
  id: number;
  deviceType: DeviceTypesType;
  deviceCertificate: null;
  name: string;
  version: string;
  filepath: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}
