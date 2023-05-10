import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { DeviceSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function DeviceNicknameForm({
  setNickName,
  setStep,
}: {
  setNickName: (value: string) => void;
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <GapView length={20} />
      <TextLabel label="Device Setup" textStyle={{ alignSelf: 'center' }} />
      <GapView length={80} />
      <MyText
        text="Let’s give your device a nick name"
        textStyle={{ alignSelf: 'center', fontSize: 16, fontWeight: '400' }}
      />
      <GapView length={80} />
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
          <>
            <Card width={WINDOW_WIDTH - 28}>
              <MyInput
                placeholder="Nick Name"
                onChangeText={handleChange('nickName')}
                value={values.nickName}
              />
            </Card>
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
