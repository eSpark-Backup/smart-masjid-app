import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function SignUpForm({
  setStep,
  type,
  onEmailPress = (value: number) => {},
  contentOpacity = 0,
}: {
  type?: 'login' | 'setup';
  setStep: (value: any) => void;
  onEmailPress: (value: number) => void;
  contentOpacity?: any;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={{ alignSelf: 'center', top: 112 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Create Account"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{top: 110}}>
        <MyText
          textStyle={{ textAlign: 'center', width: 315, fontWeight: '700' }}
          size={20}
          text={`Awesome!`}
        />
        <GapView length={15} />
        <MyText
          textStyle={{ textAlign: 'center', width: 315 }}
          text={`Let’s get your account created.\n\nWhat’s a good email to get started?
      `}
        />
        <GapView length={30} />
        <Formik
          initialValues={{ email: '' }}
          validationSchema={UserSetupSchema.emailForm}
          onSubmit={values => {
            setStep(values);
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
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  value={values.email}
                />
              </Card>
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
          <MyText text="Already have account? " />
          <MyText
            text="Login"
            pressable
            textStyle={{
              fontSize: 16,
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
    alignSelf: 'center',
    // alignItems: 'center',
  },
});
