import React, { useState } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import RnWifi from '@react-native-tethering/wifi';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import crashlytics from '@react-native-firebase/crashlytics';

let Wifi: any = null;

if (Platform.OS == 'android') {
  import('@react-native-tethering/wifi')
    .then(module => (Wifi = module.default))
    .catch(err => console.error('Error Importing library'));
}

import {
  GapView,
  MyInput,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  Rounded,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { DeviceSetupSchema } from '../../constants/validations/schema';

export default function PasswordForm({
  ssid,
  setPass,
  setStep,
  contentOpacity,
}: {
  ssid?: string;
  setPass: (value: string) => void;
  setStep: (value: number) => void;
  contentOpacity: any;
}) {
  const [loading, setLoading] = useState(false);

  const connectToWifi = async (
    {
      ssid,
      password,
    }: {
      ssid: string;
      password: string;
    },
    clear: () => void,
  ) => {
    setLoading(true);
    try {
      if (Platform.OS == 'android') {
        const res = await WifiManager.connectToProtectedSSID(
          ssid,
          password,
          false,
        );
        await WifiManager.disconnect();
        Wifi.connectToNetwork({ ssid, password })
          .then(() => {
            console.log('Connected Successfully', res);
            setLoading(false);
            setStep(6);
            clear();
          })
          .catch((error: any) => {
            console.error(error);
            crashlytics().recordError(error as Error);
            setLoading(false);
          });
      } else {
        const res = await WifiManager.connectToProtectedSSID(
          ssid,
          password,
          false,
        ).then(() => {
          console.log('Connected Successfully', res);
          setLoading(false);
          setStep(6);
          clear();
        });
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.log('error in connecting wifi', error);
      setLoading(false);
      Toast.show({
        text2: 'WiFi Password incorrect. Please try again',
        type: 'error',
        visibilityTime: 10000,
      });
      clear();
      // setStep(4);
    }
  };

  return (
    <View style={styles.container}>
      <OverlayLoader isShow={loading} />
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text={'Device Setup'} style={{ alignSelf: 'center' }} />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <MyTextSubHeader
          text="Enter Wi-Fi password"
          style={{ ...styles.text, color: '#0e0e0e' }}
        />
        <GapView length={20} />
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <MyText text={'Connecting to : '} textStyle={styles.text} />
          <MyTextSubHeader
            text={ssid!}
            style={{ ...styles.text, color: '#0e0e0e' }}
          />
        </View>
        <GapView length={30} />
        <Formik
          enableReinitialize={true}
          initialValues={{ password: '' }}
          validationSchema={DeviceSetupSchema.wifiPassword}
          onSubmit={({ password }, { resetForm }) => {
            // setStep(6);
            setPass(password);
            connectToWifi({ ssid: ssid ?? '', password }, resetForm);
          }}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={{ alignItems: 'center' }}>
              <MyInput
                placeholder="Password"
                onChangeText={handleChange('password')}
                value={values.password}
                isSecure={true}
              />
              {errors.password && touched.password && (
                <MyText
                  text={errors.password}
                  textStyle={{
                    color: 'red',
                    width: WINDOW_WIDTH - 110,
                    marginTop: 4,
                  }}
                />
              )}
              <View
                style={{
                  marginTop: 30,
                }}>
                <Rounded label="Connect" width={250} onPress={handleSubmit} />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#3e3e3e',
  },
});
