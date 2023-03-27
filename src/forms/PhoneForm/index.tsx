import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

type PhoneForm = {
  phone: string
}
export default function PhoneForm({
  setStep,
  type,
  onEmailPress = (value: number) => {}
}: {
  type?: 'login' | 'setup';
  setStep: (value: PhoneForm) => void;
  onEmailPress: (value: number) => void
}) {

  const { colors }: Theme = useTheme();
  return (
    <View style={styles.container}>
      <TextLabel
        label={
          type != 'setup' ? 'Enter Your Phone number' : 'Lets create an account'
        }
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Formik
        initialValues={{ phone: '' }}
        validationSchema={UserSetupSchema.phoneForm}
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
            <Card width={315}>
              <MyInput
                placeholder="Phone Number"
                isPhoneCode
                phoneCodeValue="+ 1"
                onChangeText={handleChange('phone')}
                value={values.phone}
              />
            </Card>
            {errors.phone && touched.phone && (
              <MyText
                text={errors.phone}
                textStyle={{ color: 'red', width: WINDOW_WIDTH - 110, marginTop: 4  }}
              />
            )}
            <View style={{ marginTop: 80, marginBottom: 40 }}>
              <Rounded label="Next" width={250} onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
      <GapView length={40} />
      <MyText
        text="Use email instead"
        pressable
        textStyle={{ fontSize: 16, fontWeight: '400', color: colors.primary }}
        onPress={() => onEmailPress(1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
