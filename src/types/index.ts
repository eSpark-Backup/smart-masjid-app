export type RootStackParamList = {
  Welcome: undefined;
  USetup: undefined;
  DSetup?: { from?: string };
  HomeBottomTab: undefined;
};

export type BottomNavigationParamList = {
  Home: undefined;
  Search: undefined;
  Device?: { from?: string };
  Profile: undefined;
};
