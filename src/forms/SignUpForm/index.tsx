import React from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';

import {
  GapView,
  MyInput,
  MyText,
  MyTextSubHeader,
  MyTitle,
  Rounded,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';

export default function SignUpForm({
  setStep,
  onEmailPress = (value: number) => {},
  contentOpacity = 0,
}: {
  setStep: (value: any) => void;
  onEmailPress: (value: number) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Create Account" />
        </Animated.View>
      </View>
      <GapView />
      <View style={{ alignItems: 'center' }}>
        <MyTextSubHeader text="Great! Let’s get your account created" />
        <GapView length={40} />
        <Formik
          initialValues={{ email: '' }}
          validationSchema={UserSetupSchema.emailForm}
          onSubmit={values => {
            setStep(values);
          }}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <MyInput
                placeholder="Email"
                onChangeText={handleChange('email')}
                value={values.email}
              />
              {errors.email && touched.email && (
                <MyText
                  text={errors.email}
                  textStyle={{
                    color: 'red',
                    width: WINDOW_WIDTH - 110,
                    marginTop: 4,
                  }}
                />
              )}
              <GapView length={40} />
              <View style={{ alignItems: 'center' }}>
                <Rounded label="Next" width={250} onPress={handleSubmit} />
              </View>
            </>
          )}
        </Formik>
        <GapView length={40} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MyText size={16} text="Already have account? " />
          <MyText
            text="Login"
            pressable
            size={16}
            textStyle={{
              fontWeight: '400',
              color: colors.primary,
            }}
            onPress={() => onEmailPress(1)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
