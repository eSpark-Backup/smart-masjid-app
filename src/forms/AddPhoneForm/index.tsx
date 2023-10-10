import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import { Theme, useTheme } from '@react-navigation/native';

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
import { Card } from '../../containers';

export default function AddPhoneForm({
  setStep,
  contentOpacity = 0,
}: {
  setStep: (value: any, any?: any) => void;
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
          <MyTitle text={'Create Account'} />
        </Animated.View>
      </View>
      <GapView />
      <View style={{ alignItems: 'center' }}>
        <MyTextSubHeader text="Would you like to add a phone number?" />
        <GapView length={30} />
        <Formik
          initialValues={{ phone: '' }}
          validationSchema={UserSetupSchema.optionalPhoneForm}
          onSubmit={values => {
            setStep(5, values);
          }}>
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Card backgroundColor="#fff" width={WINDOW_WIDTH - 50}>
                <MyInput
                  placeholder="Phone"
                  onChangeText={handleChange('phone')}
                  value={values.phone}
                  phoneCodeValue="+1"
                  isPhoneCode
                />
              </Card>
              {errors.phone && touched.phone && (
                <MyText
                  text={errors.phone}
                  textStyle={{
                    color: 'red',
                    width: WINDOW_WIDTH - 110,
                    marginTop: 4,
                  }}
                />
              )}
              <GapView length={20} />
              <MyText
                size={12}
                textStyle={{
                  color: '#9E9F9F',
                  width: 315,
                  textAlign: 'center',
                }}
                text="By signing up with Phone number you agree to receive OTP text messages every time you login with it. Message and data rates might apply."
              />
              <GapView length={30} />
              <View style={{ alignItems: 'center' }}>
                <Rounded label="Next" width={250} onPress={handleSubmit} />
              </View>
              <GapView />
              <TouchableOpacity onPress={() => setStep(6)}>
                <MyText
                  size={18}
                  text={'Skip'}
                  textStyle={{ color: colors.primary }}
                />
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
