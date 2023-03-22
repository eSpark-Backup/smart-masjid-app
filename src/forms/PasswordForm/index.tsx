import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { DeviceSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function PasswordForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Enter Wi-Fi password"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={20} />
      <MyText text="Connecting to : WiFi Network 1" textStyle={styles.text} />
      <GapView length={60} />
      <Formik
        initialValues={{ password: '' }}
        validationSchema={DeviceSetupSchema.wifiPassword}
        onSubmit={values => {
          setStep(6);
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
            <Card width={315} radius={12}>
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
                textStyle={{ color: 'red', width: WINDOW_WIDTH - 90, marginTop: 3 }}
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
  text: { fontSize: 16, fontWeight: '400' },
});
