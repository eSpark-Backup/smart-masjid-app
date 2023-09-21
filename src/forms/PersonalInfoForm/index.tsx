import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';

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
import { UserSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function PersonalInfoForm({
  setStep,
  contentOpacity = 0,
}: {
  setStep: (value: any) => void;
  contentOpacity?: any;
}) {
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
        <MyTextSubHeader text="Lets have some details about you" />
        <GapView length={40} />
        <Formik
          initialValues={{ firstName: '', lastName: '' }}
          validationSchema={UserSetupSchema.PersonalInfoForm}
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
              <MyInput
                placeholder="First Name"
                isDivider
                dividerWidth={0.25}
                dividerColor="rgba(158, 159, 159, 1)"
                onChangeText={handleChange('firstName')}
                value={values.firstName}
                containerStyle={{ alignSelf: 'center' }}
              />
              <GapView length={20} />
              <MyInput
                placeholder="Last Name"
                onChangeText={handleChange('lastName')}
                value={values.lastName}
                containerStyle={{ alignSelf: 'center' }}
              />
              {errors.firstName && touched.firstName && (
                <MyText
                  text={errors.firstName}
                  textStyle={{
                    color: 'red',
                    width: WINDOW_WIDTH - 75,
                    marginTop: 4,
                  }}
                />
              )}
              {errors.lastName && touched.lastName && (
                <MyText
                  text={errors.lastName}
                  textStyle={{
                    color: 'red',
                    width: WINDOW_WIDTH - 75,
                    marginTop: 4,
                  }}
                />
              )}
              <GapView length={40} />
              <View>
                <Rounded label="Next" width={250} onPress={handleSubmit} />
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
    alignItems: 'center',
  },
});
