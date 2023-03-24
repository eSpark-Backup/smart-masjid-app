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
