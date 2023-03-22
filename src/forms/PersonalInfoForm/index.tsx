import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';

export default function PersonalInfoForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Lets have some details about you"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={56} />
      <Formik
        initialValues={{ firstName: '', lastName: '' }}
        validationSchema={UserSetupSchema.PersonalInfoForm}
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
            <Card width={315} radius={12}>
              <MyInput
                placeholder="First Name"
                isDivider
                dividerWidth={0.25}
                dividerColor="rgba(158, 159, 159, 1)"
                onChangeText={handleChange('firstName')}
                value={values.firstName}
              />
              <MyInput
                placeholder="Last Name"
                onChangeText={handleChange('lastName')}
                value={values.lastName}
              />
            </Card>
            {errors.firstName && touched.firstName && (
              <MyText
                text={errors.firstName}
                textStyle={{ color: 'red', width: WINDOW_WIDTH - 90, marginTop: 3 }}
              />
            )}
            {errors.lastName && touched.lastName && (
              <MyText
                text={errors.lastName}
                textStyle={{ color: 'red', width: WINDOW_WIDTH - 90, marginTop: 3 }}
              />
            )}
            <View style={{ marginTop: 60, marginBottom: 40 }}>
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
