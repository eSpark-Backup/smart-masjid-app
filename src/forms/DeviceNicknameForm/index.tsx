import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';

import {
  GapView,
  MyInput,
  MyText,
  MyTextSubHeader,
  MyTitle,
  Rounded,
  TextLabel,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { DeviceSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function DeviceNicknameForm({
  setNickName,
  setStep,
  currentDeviceName,
  autoFillName,
  contentOpacity,
}: {
  setNickName: (value: string) => void;
  setStep: (value: number) => void;
  currentDeviceName: string;
  autoFillName?: boolean;
  contentOpacity: any;
}) {
  useEffect(() => {
    if (autoFillName && currentDeviceName) {
      setStep(4);
      setNickName(currentDeviceName);
    }
  }, [autoFillName]);

  return (
    <View style={styles.container}>
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
          <MyTitle text={'Device Setup'} />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <MyTextSubHeader
          text="Let’s give your device a name"
          style={{ alignSelf: 'center' }}
        />
        <GapView length={30} />
        <Formik
          initialValues={{ nickName: '' }}
          validationSchema={DeviceSetupSchema.deviceNickName}
          onSubmit={({ nickName }) => {
            setStep(4);
            setNickName(nickName);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{ alignItems: 'center' }}>
              <MyInput
                placeholder="Device Name"
                onChangeText={handleChange('nickName')}
                value={values.nickName}
                maxLength={25}
              />
              {errors.nickName && touched.nickName && (
                <MyText
                  text={errors.nickName}
                  textStyle={{
                    color: 'red',
                    width: WINDOW_WIDTH - 110,
                    marginTop: 4,
                  }}
                />
              )}
              <GapView length={30} />
              <View>
                <Rounded label="Next" width={250} onPress={handleSubmit} />
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
});
