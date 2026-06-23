import React, { useEffect, useCallback, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { State, useHookstate } from '@hookstate/core';
import { getUniqueId } from 'react-native-device-info';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import crashlytics from '@react-native-firebase/crashlytics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WelcomeScreen, UserSetupScreen, DeviceSetupScreen } from '../screens';
import { MyLightTheme } from '../theme';
import { GlobalProps, RootStackParamList } from '../types';
import HomeBottomTab from './BottomNavigation';
import { _getPhoneId } from '../utils';
import { globalStore } from '../store/GlobalStates';
import { getDataFromLocalStorage, _getFCMToken } from '../utils/functions';
import { userStore } from '../store/UserStore';
import { UserResponse, UserToken } from '../types/userControllerApiResponse';
import { BlurBackground, OverlayLoader } from '../components';
import {
  GetCountryCodes,
  RefreshToken,
  _checkPhoneId,
} from '../api/externalControllers';
import { api } from '../api';
import { subJummas, SubscriptionList } from '../types/masjidControllerTypes';
import { masjidStore } from '../store/MasjidStore';
import NoInternetModal from '../components/NoInternetModal';
import { ToastProvider } from '../components/TheToast';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const [checkedId, setCheckedId] = useState<boolean | null>(null);
  const userData = useHookstate(userStore.userData);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isInternetReachable);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleDeviceIdCheck();
  }, [userData]);

  useEffect(() => {
    if (userData.get()) {
      getSubscribedJummas();
    }
  }, [userStore.userData.get()?.masjid?.subscriptionList]);

  useEffect(() => {
    if (userStore.userData.get()) {
      crashlytics().setUserId(userData.get()?.id.toString()!);
      crashlytics().setAttributes({
        id: userData.get()?.id.toString()!,
        email: userData.get()?.email!,
        phone: userData.get()?.phone!,
      });
    }
  }, [userStore.userData.get()]);

  const getSubscribedJummas = useCallback(() => {
    let jummas: subJummas;

    try {
      if (userStore.userData.get()?.masjid?.subscriptionList) {
        userData
          .get()
          ?.masjid?.subscriptionList?.forEach((item: SubscriptionList) => {
            if (item?.subscriptionType?.name == 'JUMUAH_1') {
              jummas = { ...jummas, jumma1: true };
            } else if (item?.subscriptionType?.name == 'JUMUAH_2') {
              jummas = { ...jummas, jumma2: true };
            } else if (item?.subscriptionType?.name == 'JUMUAH_3') {
              jummas = { ...jummas, jumma3: true };
            }
            masjidStore?.masjidsJummaSubs?.set(jummas);
          });
      }
    } catch (e) {
      console.error('At get subscriobed jummahs');
      crashlytics().recordError(e as Error);
    }
  }, [userStore.userData.get()?.masjid?.subscriptionList]);

  useEffect(() => {
    GetCountryCodes();
    if (Platform.OS == 'android') {
      _getFCMToken();
    }
    getDataFromLocalStorage('user').then((res: any) => {
      if (res != null) {
        const data: UserResponse = JSON.parse(res);
        userData.set(data);
      }
    });
    getDataFromLocalStorage('token').then(async (res: any) => {
      if (res != null) {
        const token = JSON.parse(res);
        const jwtDecodedObj: UserToken = jwtDecode(token);
        console.log('token', token);
        if (
          // jwtDecodedObj.exp is unix date thats why we multiply to 1000 to convert to real date
          moment(moment(new Date()))
            .subtract(1, 'day')
            // @ts-ignore
            .isSameOrAfter(new Date(jwtDecodedObj.exp * 1000))
        ) {
          console.log('IF Token Expiration is Today');
          await RefreshToken();
          return;
        }
        api.setHeaders({
          Authorization: `Bearer ${token}`,
        });
        userStore.token.set(token);
      }
    });
  }, []);

  useEffect(() => {
    if (checkedId != null) {
      SplashScreen.hide();
      state.globalLoading.set(false);
    } else {
      state.globalLoading.set(true);
    }
  }, [checkedId]);

  const handleDeviceIdCheck = useCallback(async () => {
    const res = await getUniqueId();
    console.log('kia mila', res);
    state.phoneId.set(res.toString());
    try {
      const check: any = await _checkPhoneId(res);
      if (check) {
        console.log('phone device is registered already!', check.deviceId);
        state.isDeviceRegistered.set(true);
        setCheckedId(true);
      } else {
        state.isDeviceRegistered.set(false);
        setCheckedId(false);
      }
    } catch (error) {
      console.log('error', error);
      crashlytics().recordError(error as Error);
    }
  }, []);

  if (checkedId !== null) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <NavigationContainer theme={MyLightTheme}>
            <Stack.Navigator
              initialRouteName={checkedId ? 'USetup' : 'Welcome'}
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}>
              {!userData.get()?.id ? (
                <Stack.Group>
                  {!checkedId ? (
                    <>
                      <Stack.Screen name="Welcome" component={WelcomeScreen} />
                      <Stack.Screen name="USetup" component={UserSetupScreen} />
                    </>
                  ) : (
                    <>
                      <Stack.Screen name="USetup" component={UserSetupScreen} />
                      <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    </>
                  )}
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen
                    name="HomeBottomTab"
                    component={HomeBottomTab}
                  />
                  <Stack.Screen name="DSetup" component={DeviceSetupScreen} />
                </Stack.Group>
              )}
            </Stack.Navigator>
            <ToastProvider />
            <OverlayLoader
              loaderColor={'rgb(0, 104, 112)'}
              isShow={Boolean(state.globalLoading.get())}
              msg={state.globalLoadingMsg.get()}
              onBtnPress={() =>
                Boolean(state.globalLoading.get()) == true
                  ? state.globalLoading.set(false)
                  : state.globalLoading.set(true)
              }
            />
            <BlurBackground
              show={isConnected == false && state.hideNetError.get() == false}
            />
            <NoInternetModal
              isVisible={
                isConnected == false && state.hideNetError.get() == false
              }
            />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  } else {
    return <OverlayLoader loaderColor={'rgb(0, 104, 112)'} isShow={false} />;
  }
}
