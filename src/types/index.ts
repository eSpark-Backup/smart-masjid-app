import { UserResponse } from "./userControllerApiResponse";

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
  phoneId: string | null;
  fcmToken: string;
}

export type UserStoreProps = {
  userData: UserResponse | null;
}