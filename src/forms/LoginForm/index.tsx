import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  GapView,
  MyInput,
  MyText,
  Rounded,
  TabView,
  TextLabel,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';
import { Card } from '../../containers';
import { useLayoutAnimation } from '../../utils';

export default function LoginForm({
  type,
  setStep,
  onPhonePress = () => {},
}: {
  type?: 'login' | 'setup';
  setStep: (value: any) => void;
  onPhonePress?: (value: any) => void;
}) {
  const { colors }: Theme = useTheme();
  const [activeTab, setActiveTab] = React.useState('1');

  React.useEffect(() => {
    useLayoutAnimation(300);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <GapView length={20} />
      <TextLabel label="Login" textStyle={{ alignSelf: 'center' }} />
      <GapView length={80} />
      <TabView
        tab1Title="Email"
        tab2Title="Phone number"
        onChange={setActiveTab}
      />
      {/* <TextLabel
        label={type != 'setup' ? 'Enter Your Email' : 'Lets create an account'}
        textStyle={{ alignSelf: 'center' }}
      /> */}
      <GapView length={60} />
      <Formik
        initialValues={{ email: 'test2@yopmail.com' }}
        validationSchema={
          activeTab == '1'
            ? UserSetupSchema.emailForm
            : UserSetupSchema.phoneForm
        }
        onSubmit={values => {
          // @ts-ignore
          setStep({ email: values.email ?? '', phone: values.phone ?? '' });
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
            {activeTab == '1' ? (
              <>
                <Card width={315}>
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
              </>
            ) : (
              <>
                <Card width={315}>
                  <MyInput
                    placeholder="Phone"
                    onChangeText={handleChange('phone')}
                    // @ts-ignore
                    value={values?.phone}
                    isPhoneCode
                  />
                </Card>
                {/* @ts-ignore */}
                {errors.phone && touched.phone && (
                  <MyText
                    // @ts-ignore
                    text={errors.phone}
                    textStyle={{
                      color: 'red',
                      width: WINDOW_WIDTH - 110,
                      marginTop: 4,
                    }}
                  />
                )}
              </>
            )}
            <GapView length={60} />
            <View style={{ alignSelf: 'center' }}>
              <Rounded label="Next" width={250} onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
      <GapView length={60} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MyText text="Don’t have account? " />
        <MyText
          text="Create account"
          pressable
          textStyle={{ fontSize: 16, fontWeight: '400', color: colors.primary }}
          onPress={() => onPhonePress(2)}
        />
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
