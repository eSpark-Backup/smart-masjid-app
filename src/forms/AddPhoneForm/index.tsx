import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function AddPhoneForm({
  setStep,
  type,
  contentOpacity = 0,
}: {
  type?: 'login' | 'setup';
  setStep: (value: any, any?: any) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View style={styles.container}>
      <GapView length={20} />
      <TextLabel label="" textStyle={{ alignSelf: 'center' }} />
      <GapView length={40} />

      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label={'Create Account'}
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 120 }}>
        <MyText
          textStyle={{ textAlign: 'center', width: 315 }}
          text={`Would you like to add a phone number?\n\nYou can skip now add it later as well.`}
        />
        <GapView length={40} />
        <Formik
          initialValues={{ phone: '' }}
          validationSchema={UserSetupSchema.optionalPhoneForm}
          onSubmit={values => {
            setStep(5, values);
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
              <Card backgroundColor="#fff" width={315}>
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
              <GapView length={15} />
              <MyText
                size={12}
                textStyle={{
                  color: '#9E9F9F',
                  width: 315,
                  textAlign: 'center',
                }}
                text="By signing up with Phone number you agree to receive OTP text messages every time you login with it. Message and data rates might apply."
              />
              <GapView length={40} />
              <View style={{ alignItems: 'center' }}>
                <Rounded label="Next" width={250} onPress={handleSubmit} />
              </View>
              <GapView />
              <View style={{ alignItems: 'center' }}>
                <Rounded
                  outlined
                  label="Skip"
                  width={250}
                  onPress={() => setStep(6)}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    // alignItems: 'center',
  },
});
