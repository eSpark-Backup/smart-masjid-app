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
      <GapView length={40} />
      <TabView
        tab1Title="Email"
        tab2Title="Phone number"
        onChange={setActiveTab}
      />

      <GapView length={40} />
      <Formik
        initialValues={{ email: 'faraz@esparkconsultants.com' }}
        validationSchema={
          activeTab == '1'
            ? UserSetupSchema.emailForm
            : UserSetupSchema.phoneForm
        }
        onSubmit={({ email, phone }: { email?: string; phone?: string }) => {
          setStep({ email: email ?? '', phone: phone ?? '' });
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
              </>
            ) : (
              <>
                <Card backgroundColor="#fff" width={315}>
                  <MyInput
                    placeholder="Phone"
                    onChangeText={handleChange('phone')}
                    value={values?.phone}
                    isPhoneCode
                    phoneCodeValue="US"
                    onPhoneCodeChange={e => {
                      console.log('e', e);
                    }}
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
              </>
            )}
            <GapView length={40} />
            <View style={{ alignSelf: 'center' }}>
              <Rounded label="Next" width={250} onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
      <GapView length={40} />
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
  },
});
