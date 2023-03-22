import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { DeviceSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function DeviceNicknameForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Let’s give your device a nick name"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Formik
        initialValues={{ nickName: '' }}
        validationSchema={DeviceSetupSchema.deviceNickName}
        onSubmit={values => {
          setStep(4);
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
            <Card width={315}>
              <MyInput
                placeholder="Nick Name"
                onChangeText={handleChange('nickName')}
                value={values.nickName}
              />
            </Card>
            {errors.nickName && touched.nickName && (
              <MyText
                text={errors.nickName}
                textStyle={{ color: 'red', width: WINDOW_WIDTH - 9, marginTop: 30 }}
              />
            )}
            <View style={{ marginTop: 80, marginBottom: 40 }}>
              <Rounded label="Next" width={250} onPress={handleSubmit} />
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
});
