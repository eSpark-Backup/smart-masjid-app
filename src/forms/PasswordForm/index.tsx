import React, { useCallback, useState, useRef } from 'react';
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import RnWifi from '@react-native-tethering/wifi';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  GapView,
  MyInput,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  Rounded,
  TextLabel,
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
  const connectToWifi = async ({
    ssid,
    password,
  }: {
    ssid: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const res = await WifiManager.connectToProtectedSSID(
        ssid,
        password,
        false,
      );
      await WifiManager.disconnect();
      RnWifi.connectToNetwork({ ssid, password })
        .then(() => {
          console.log('Connected Successfully', res);
          setLoading(false);
          setStep(6);
        })
        .catch(e => console.error(e));
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.log('error in connecting wifi', error);
      setLoading(false);
      Toast.show({
        text2: 'WiFi Password incorrect. Please try again',
        type: 'error',
        visibilityTime: 10000,
      });
      // setStep(4);
    }
  };

  return (
    <View style={styles.container}>
      <OverlayLoader isShow={loading} />
      <View style={{ alignSelf: 'center', top: 128 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text={'Device Setup'} style={{ alignSelf: 'center' }} />
        </Animated.View>
        <GapView length={50} />
      </View>
      <View style={{ top: 130 }}>
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
        <GapView length={60} />
        <Formik
          enableReinitialize={true}
          initialValues={{ password: '' }}
          validationSchema={DeviceSetupSchema.wifiPassword}
          onSubmit={({ password }, { resetForm }) => {
            // setStep(6);
            setPass(password);
            connectToWifi({ ssid: ssid ?? '', password });
            resetForm();
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
                  marginTop: 60,
                  marginBottom: 40,
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
