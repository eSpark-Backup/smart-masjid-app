import React, { useRef } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { Formik, FormikFormProps, FormikProps } from 'formik';
import { phone as isValidPhone } from 'phone';
import Toast from 'react-native-toast-message';

import {
  GapView,
  MyInput,
  MyText,
  MyTitle,
  Rounded,
  TabView,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { UserSetupSchema } from '../../constants/validations/schema';
import { useLayoutAnimation } from '../../utils';
import { CountryCodes } from '../../types';

const LoginForm = ({
  type,
  setStep,
  onPhonePress = () => {},
  contentOpacity = 0,
}: {
  type?: 'login' | 'setup';
  setStep: (value: any) => void;
  onPhonePress?: (value: any) => void;
  contentOpacity?: any;
}) => {
  const { colors }: Theme = useTheme();
  const [activeTab, setActiveTab] = React.useState('1');
  const [currentCountry, setCurrentCountry] = React.useState<CountryCodes>();

  React.useEffect(() => {
    useLayoutAnimation(300);
  }, [activeTab]);

  const formRef = useRef<any>();

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
          <MyTitle text="Login" />
        </Animated.View>
      </View>
      <GapView length={5} />
      <View style={{ alignItems: 'center' }}>
        <TabView
          tab1Title="Email"
          tab2Title="Phone number"
          onChange={tab => {
            setActiveTab(tab);
            formRef.current?.resetForm();
          }}
        />
        <GapView length={40} />
        <Formik
          initialValues={{ email: '', phone: '' }}
          innerRef={formRef}
          validationSchema={
            activeTab == '1'
              ? UserSetupSchema.emailForm
              : UserSetupSchema.phoneForm
          }
          onSubmit={({ email, phone }: { email?: string; phone?: string }) => {
            console.log(
              'what is the phone value',
              currentCountry?.code + phone!,
            );
            if (phone) {
              const isValid = isValidPhone(phone, {
                country: currentCountry?.iso_code,
              }).isValid;
              console.log('oh', isValid);
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
                  <MyInput
                    placeholder="Email"
                    onChangeText={handleChange('email')}
                    value={values.email}
                  />
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
          <MyText size={16} text="Don’t have account? " />
          <MyText
            text="Create account"
            pressable
            size={16}
            textStyle={{
              fontWeight: '400',
              color: colors.primary,
            }}
            onPress={() => onPhonePress(2)}
          />
        </View>
      </View>
    </View>
  );
};
export default LoginForm;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
