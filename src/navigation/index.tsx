import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast, {
  BaseToast,
  ErrorToast,
  BaseToastProps,
} from 'react-native-toast-message';
import { State, useHookstate } from '@hookstate/core';
import { getUniqueId } from 'react-native-device-info';

import { WelcomeScreen, UserSetupScreen, DeviceSetupScreen } from '../screens';
import { MyLightTheme } from '../theme';
import { GlobalProps, RootStackParamList } from '../types';
import HomeBottomTab from './BottomNavigation';
import { _getPhoneId } from '../utils';
import { globalStore } from '../store/GlobalStates';
import { getDataFromLocalStorage, _getFCMToken } from '../utils/functions';
import { userStore } from '../store/UserStore';
import { UserResponse, UserToken } from '../types/userControllerApiResponse';
import { OverlayLoader } from '../components';
import {
  GetCountryCodes,
  RefreshToken,
  _checkPhoneId,
} from '../api/externalControllers';
import { api } from '../api';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.successStyle}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text1="Success!"
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={styles.errorStyle}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text1="Oops!"
    />
  ),

  warning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.warningStyle}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text1="Hold Up!"
    />
  ),
};

export default function App() {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const [checkedId, setCheckedId] = useState<boolean | null>(null);
  const userData = useHookstate(userStore.userData);
  const userToken = useHookstate(userStore.token);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    handleDeviceIdCheck();
  }, [userData]);

  useEffect(() => {
    GetCountryCodes();
    _getFCMToken();
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

    setTimeout(() => {
      SplashScreen.hide();
    }, 5000);
  }, []);

  const handleDeviceIdCheck = useCallback(async () => {
    setLoader(true);
    const res = await getUniqueId();
    console.log('kia mila', res);
    state.phoneId.set(res.toString());
    try {
      const check: any = await _checkPhoneId(res);
      if (check?.deviceId) {
        console.log('phone device is registered already!', check.deviceId);
        state.isDeviceRegistered.set(true);
        setCheckedId(true);
      } else {
        state.isDeviceRegistered.set(false);
        setCheckedId(false);
      }
    } catch (e) {
      console.log('error', e);
    }
    setLoader(false);
  }, []);

  if (checkedId !== null) {
    return (
      <NavigationContainer theme={MyLightTheme}>
        <Stack.Navigator
          initialRouteName={checkedId ? 'USetup' : 'Welcome'}
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}>
          {!userData.get()?.id ? (
            <Stack.Group>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="USetup" component={UserSetupScreen} />
              <Stack.Screen name="DSetup" component={DeviceSetupScreen} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="HomeBottomTab" component={HomeBottomTab} />
              <Stack.Screen name="DSetup" component={DeviceSetupScreen} />
            </Stack.Group>
          )}
        </Stack.Navigator>
        <Toast
          config={toastConfig}
          topOffset={StatusBar.currentHeight}
          visibilityTime={5000}
        />
      </NavigationContainer>
    );
  } else {
    return <OverlayLoader loaderColor={'rgb(0, 104, 112)'} isShow={false} />;
  }
}

const styles = StyleSheet.create({
  successStyle: { width: '90%', borderLeftColor: '#98c379' },
  errorStyle: { width: '90%', borderLeftColor: '#FF6464' },
  warningStyle: { width: '90%', borderLeftColor: '#f2be09' },
  text1Style: {
    fontFamily: 'roboto',
    fontSize: 14,
  },
  text2Style: {
    fontFamily: 'roboto',
    fontSize: 12,
  },
});
