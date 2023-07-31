import { Theme, useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { phone as isValidPhone } from 'phone';
import Toast from 'react-native-toast-message';

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
import { CountryCodes } from '../../types';

const LoginForm = ({
  type,
  setStep,
  onPhonePress = () => {},
}: {
  type?: 'login' | 'setup';
  setStep: (value: any) => void;
  onPhonePress?: (value: any) => void;
}) => {
  const { colors }: Theme = useTheme();
  const [activeTab, setActiveTab] = React.useState('1');
  const [currentCountry, setCurrentCountry] = React.useState<CountryCodes>();

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
        initialValues={{ email: '' }}
        validationSchema={
          activeTab == '1'
            ? UserSetupSchema.emailForm
            : UserSetupSchema.phoneForm
        }
        onSubmit={({ email, phone }: { email?: string; phone?: string }) => {
          console.log('what is the phone value', currentCountry?.code + phone!);
          if (phone) {
            const isValid = isValidPhone(phone, {
              country: currentCountry?.iso_code,
            }).isValid;
            if (isValid) {
              setStep({ phone: currentCountry?.code + phone, email: '' });
            } else {
              Toast.show({
                text2: 'Phone number is not valid',
                type: 'error',
                visibilityTime: 10000,
              });
            }
          } else {
            setStep({ email: email, phone: '' });
          }
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
                    onPhoneCodeChange={country => {
                      console.log('e', country);
                      setCurrentCountry(country);
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
};
export default LoginForm;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
