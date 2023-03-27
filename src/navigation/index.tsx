import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast, {
  BaseToast,
  ErrorToast,
  BaseToastProps,
} from 'react-native-toast-message';
import { useHookstate } from '@hookstate/core';
import { getUniqueId } from 'react-native-device-info';

import { WelcomeScreen, UserSetupScreen, DeviceSetupScreen } from '../screens';
import { MyLightTheme } from '../theme';
import { RootStackParamList } from '../types';
import HomeBottomTab from './BottomNavigation';
import { _getPhoneId } from '../utils';
import { globalStore } from '../store/GlobalStates';
import { _checkPhoneId } from '../api/userController';

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
  const state = useHookstate(globalStore);
  const [checkedId, setCheckedId] = useState<boolean | null>(null);

  useEffect(() => {
    data();
  }, []);

  const data = useCallback(async () => {
    const res = await getUniqueId();
    console.log('kia mila', res);
    state.set({ phoneId: res });
    try {
      const check: any = await _checkPhoneId(res);
      if (check?.deviceId) {
        console.log('hoa', check.deviceId);
        setCheckedId(true);
      } else {
        setCheckedId(false);
      }
    } catch (e) {
      console.log('error', e);
    }
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
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="USetup" component={UserSetupScreen} />
          <Stack.Screen name="DSetup" component={DeviceSetupScreen} />
          <Stack.Screen name="HomeBottomTab" component={HomeBottomTab} />
        </Stack.Navigator>
        <Toast config={toastConfig} topOffset={25} visibilityTime={2000} />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  successStyle: { width: '90%', borderLeftColor: '#98c379' },
  errorStyle: { width: '90%', borderLeftColor: '#cf6362' },
  warningStyle: { width: '90%', borderLeftColor: '#f2ee6a' },
  text1Style: {
    fontFamily: 'roboto',
    fontSize: 14,
  },
  text2Style: {
    fontFamily: 'roboto',
    fontSize: 12,
  },
});
