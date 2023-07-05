import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import Toast from 'react-native-toast-message';

import {
  GapView,
  MyInput,
  MyText,
  OverlayLoader,
  Rounded,
  TextLabel,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { DeviceSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function PasswordForm({
  ssid,
  setPass,
  setStep,
}: {
  ssid?: string;
  setPass: (value: string) => void;
  setStep: (value: number) => void;
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
      const res: any = await WifiManager.connectToProtectedSSID(
        ssid,
        password,
        true,
      );
      console.log('connection?', res);
      if (res === 'connected') {
        setLoading(false);
        setStep(6);
      }
    } catch (e) {
      console.log('error in connecting wifi', e);
      setLoading(false);
      Toast.show({
        text2: 'Wifi not connected successfully',
        type: 'error',
        visibilityTime: 10000,
      });
      setStep(4);
    }
  };

  return (
    <View style={styles.container}>
      <OverlayLoader isShow={loading} />
      <GapView length={20} />
      <TextLabel label="Device Setup" textStyle={{ alignSelf: 'center' }} />
      <GapView length={40} />
      <MyText
        text="Enter Wi-Fi password"
        textStyle={{ alignSelf: 'center', fontSize: 16, fontWeight: '400' }}
      />
      <GapView length={20} />
      <MyText text={'Connecting to : ' + ssid} textStyle={styles.text} />
      <GapView length={60} />
      <Formik
        initialValues={{ password: '' }}
        validationSchema={DeviceSetupSchema.wifiPassword}
        onSubmit={({ password }) => {
          // setStep(6);
          setPass(password);
          connectToWifi({ ssid: ssid ?? '', password });
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Card width={WINDOW_WIDTH - 28} radius={12}>
              <MyInput
                placeholder="Password"
                onChangeText={handleChange('password')}
                value={values.password}
                isSecure={true}
              />
            </Card>
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
            <View style={{ marginTop: 60, marginBottom: 40 }}>
              <Rounded label="Connect" width={250} onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: { fontSize: 16, fontWeight: '400', textAlign: 'center' },
});
