import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useHookstate } from '@hookstate/core';

import { Wrapper } from '../../containers';
import {
  LoginForm,
  OtpForm,
  SignUpForm,
  PersonalInfoForm,
  AddPhoneForm,
} from '../../forms';
import { RootStackParamList } from '../../types';
import {
  GapView,
  MyText,
  MyToast,
  OverlayLoader,
  SLoader,
} from '../../components';
import {
  CheckUserExists,
  CreateUser,
  LoginUser,
  RegisterUserPhone,
  SendOTP,
  ValidateOTP,
} from '../../api/userController';
import {
  CreateUserRequest,
  UserResponse,
} from '../../types/userControllerApiResponse';
import { globalStore } from '../../store/GlobalStates';
import { _getFCMToken } from '../../utils/functions';

type Props = NativeStackScreenProps<RootStackParamList, 'USetup'>;

export default function UserSetupScreen() {
  const navigation = useNavigation<Props['navigation']>();
  const phoneId = useHookstate(globalStore.phoneId).get();
  const isDeviceRegistered = useHookstate(globalStore.isDeviceRegistered).get();
  const fcmToken = useHookstate(globalStore.fcmToken).get();
  const [activeFlow, setActiveFlow] = useState('login');
  const route = useRoute<Props['route']>();
  const [step, setStep] = useState(1);
  const [otp, setOTP] = useState('');
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [data, setData] = useState<CreateUserRequest>({
    firstName: 'string',
    lastName: 'string',
    userType: 'Customer',
  });

  useEffect(() => {
    if (route.params?.type == 'setup') {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [route.params?.type]);

  const handleBack = () => {
    if (step == 3) {
      return activeFlow == 'signup' ? 2 : 1;
    }
    if (step !== 1) {
      return step - 1;
    }
    navigation.goBack();
    return 1;
  };

  const onSubmit = async (dataObj: CreateUserRequest, otp: string) => {
    setStep(7);
    const res: UserResponse | undefined | any = await CreateUser(dataObj, otp);
    console.log('res', res);

    if (res?.id && phoneId) {
      await RegisterUserPhone(
        { deviceId: phoneId, fcmToken: fcmToken as string },
        res?.id.toString(),
      );
      setStep(8);
    } else {
      setStep(6);
      Toast.show({
        text2: res?.message,
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  };

  const onLogin = async (email: string, phone: string, OTPvalue: string) => {
    setLoader(true);
    const res = await LoginUser(email, phone, OTPvalue);
    if (res?.id && phoneId && !isDeviceRegistered) {
      await RegisterUserPhone(
        { deviceId: phoneId, fcmToken: fcmToken as string },
        res?.id.toString(),
      );
    }

    if (res?.id) {
      navigation.navigate('HomeBottomTab'); //TODO: Change it later
      // navigation.navigate('DSetup');
    }
    setLoader(false);
  };

  const CheckIsUserExist = async (
    email?: string,
    phone?: string,
    type?: string,
  ) => {
    setLoader(true);
    const res: any = await CheckUserExists(email ?? '', phone ?? '');
    if (type == 'signup') {
      if (res?.id) {
        Toast.show({
          text2: 'User Already Exist',
          type: 'error',
          visibilityTime: 10000,
        });
      } else {
        const result = await SendOTP(email, phone);
        if (result) {
          setData({ ...data, email: email ?? '', phone: phone ?? '' });
          setStep(3);
        }
      }
    } else {
      if (res?.id) {
        const result = await SendOTP(email, phone);
        if (result) {
          setData({ ...data, email: email ?? '', phone: phone ?? '' });
          setStep(3);
        }
      } else {
        Toast.show({
          text2: 'User not found!',
          type: 'error',
          visibilityTime: 10000,
        });
      }
    }

    setLoader(false);
  };

  return (
    <>
      <OverlayLoader isShow={loader} />
      <Wrapper
        bgImageSpacer={false}
        showBack={step == 1 ? false : true}
        onBackPress={() => !disable && setStep(handleBack)}>
        <ScrollView>
          {step == 1 && (
            <LoginForm
              type={route.params?.type}
              onPhonePress={value => setStep(value)}
              setStep={values => {
                CheckIsUserExist(
                  values.email?.toLowerCase(),
                  values.phone,
                  'login',
                );
                setActiveFlow('login');
              }}
            />
          )}
          {step == 2 && (
            <SignUpForm
              onEmailPress={value => setStep(value)}
              type={route.params?.type}
              setStep={values => {
                CheckIsUserExist(
                  values.email?.toLowerCase(),
                  undefined,
                  'signup',
                );
                setActiveFlow('signup');
              }}
            />
          )}
          {step == 3 && (
            <OtpForm
              title={activeFlow == 'signup' ? 'Create Account' : 'Login'}
              type={route.params?.type}
              setStep={async (value: string) => {
                setLoader(true);
                const isVerified = await ValidateOTP(
                  value,
                  data.email ?? '',
                  data.phone ?? '',
                );
                console.log('isVerified', isVerified);
                if (isVerified) {
                  if (activeFlow == 'signup') {
                    setStep(4);
                    setOTP(value);
                    setLoader(false);
                  } else {
                    setOTP(value);
                    onLogin(
                      data?.email?.toLowerCase() ?? '',
                      data.phone ?? '',
                      value,
                    );
                  }
                }
                setLoader(false);
              }}
              onResend={async () => {
                await SendOTP(data.email ?? '', data.phone ?? '');
              }}
            />
          )}
          {step == 4 && (
            <AddPhoneForm
              type={route.params?.type}
              setStep={(value: number, values: any) => {
                setStep(6);
                // setData({ ...data, phone: values?.phone ?? '' });
              }}
            />
          )}
          {step == 5 && (
            <OtpForm
              title="Create Account"
              type={route.params?.type}
              setStep={(value: string) => setStep(6)}
            />
          )}
          {step == 6 && (
            <PersonalInfoForm
              setStep={values => {
                setData({ ...data, ...values });
                onSubmit({ ...data, ...values }, otp);
              }}
            />
          )}
          {step == 7 && (
            <SLoader
              title={
                route.params?.type == 'login' ? 'Loggin In' : 'Creating Account'
              }
              subtitle="Creating Account"
              message={
                route.params?.type == 'login'
                  ? 'Logging into the System.'
                  : 'Your account will be ready soon.'
              }
            />
          )}
          {step == 8 && (
            <MyToast
              heading="Create Account"
              isSuccess={true}
              onPress={() => navigation.navigate('DSetup')}
              btnText={'Connect Device'}
              title="You’re account is all set!"
              message={`Lets setup your device`}
              points={[
                'Power on your device',
                'Turn on bluetooth on your phone',
              ]}
            />
          )}
        </ScrollView>
      </Wrapper>
    </>
  );
}

const styles = StyleSheet.create({});
