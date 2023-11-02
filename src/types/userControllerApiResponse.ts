import { Masjid } from './masjidControllerTypes';

export type SuccessCheckPhoneId = {
  deviceId: string;
  fcmToken: string;
  isNotificationsAllowed: string;
  isLoggedIn: string;
  lastLogin: Date;
};

export type FailCheckPhoneId = {
  message: string;
  status: string;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  userType?: 'Customer' | 'Masjid Admin';
  userTypeId?: number;
  masjidId?: string;
};

export type UserToken = {
  sub: string;
  userId: number;
  masjidId: number;
  userType: {
    id: number;
    name: 'Customer' | 'Masjid Admin';
    permissions: {
      id: number;
      name: 'MANAGE_MASJID' | 'MANAGE_USERS';
    }[];
  };
  iat: Date;
  exp: Date;
};

export type UserPermissions = {
  id: number;
  name: string;
};

export type UserType = {
  id: number;
  name: string;
  permissions: UserPermissions[];
};

export type UserPhone = {
  deviceId: string;
  fcmToken: string;
  isNotificationsAllowed: string;
  isLoggedIn: string;
  lastLogin: string;
};

export type UserResponse = {
  id: number;
  userPhone: UserPhone[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: UserType;
  masjid: Masjid;
  status: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
};

export type RequestRegisterPhone = {
  deviceId: string;
  fcmToken: string;
  isNotificationsAllowed?: string;
};
