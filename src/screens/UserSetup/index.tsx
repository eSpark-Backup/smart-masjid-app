import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useHookstate } from '@hookstate/core';
import crashlytics from '@react-native-firebase/crashlytics';

import { Wrapper } from '../../containers';
import {
  LoginForm,
  SignUpForm,
  OtpForm,
  PersonalInfoForm,
  AddPhoneForm,
} from './UserForms';
import { RootStackParamList } from '../../types';
import { MyToast, OverlayLoader, SLoader } from '../../components';
import { RegisterUserPhone, updateUserPhone } from '../../api/userController';
import {
  CreateUserRequest,
  UserResponse,
} from '../../types/userControllerApiResponse';
import { globalStore } from '../../store/GlobalStates';
import { _getFCMToken } from '../../utils/functions';
import {
  CheckUserExists,
  CreateUser,
  LoginUser,
  SendOTP,
  ValidateOTP,
} from '../../api/externalControllers';
import { userStore } from '../../store/UserStore';

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

  console.log('isDevice Registered?', isDeviceRegistered);

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
    if (step == 4) {
      return 2;
    }
    if (step == 6) {
      return 4;
    }
    if (step !== 1) {
      return step - 1;
    }
    navigation.goBack();
    return 1;
  };

  const onSubmit = async (dataObj: CreateUserRequest, otp: string) => {
    try {
      setStep(7);
      const res: UserResponse | undefined | any = await CreateUser(
        dataObj,
        otp,
      );
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
          text2: res?.message ?? 'Something went wrong',
          type: 'error',
          autoHide: true,
          visibilityTime: 10000,
        });
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const onLogin = async (email: string, phone: string, OTPvalue: string) => {
    try {
      setLoader(true);
      const res = await LoginUser(email, phone, OTPvalue);
      if (res?.id && phoneId && !isDeviceRegistered) {
        await RegisterUserPhone(
          { deviceId: phoneId, fcmToken: fcmToken as string },
          res?.id.toString(),
        );
      } else if (res?.id && phoneId && isDeviceRegistered) {
        await updateUserPhone(fcmToken as string, res?.id.toString(), phoneId);
      }

      if (res?.id) {
        navigation.navigate('HomeBottomTab'); //TODO: Change it later
      }
      setLoader(false);
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const CheckIsUserExist = async (
    email?: string,
    phone?: string,
    type?: string,
  ) => {
    try {
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
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  return (
    <>
      <OverlayLoader isShow={loader} />
      <Wrapper
        bgImageSpacer={false}
        showBack={step == 1 ? false : true}
        onBackPress={() => !disable && setStep(handleBack)}>
        {({ props }) => {
          return (
            <>
              {step == 1 && (
                <LoginForm
                  contentOpacity={props.contentOpacity}
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
                  contentOpacity={props.contentOpacity}
                  onEmailPress={value => setStep(value)}
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
                  contentOpacity={props.contentOpacity}
                  title={activeFlow == 'signup' ? 'Create Account' : 'Login'}
                  userEmail={data.email}
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
                  goBack={() => setStep(2)}
                  onResend={async () => {
                    await SendOTP(data.email ?? '', data.phone ?? '');
                  }}
                />
              )}
              {step == 4 && (
                <AddPhoneForm
                  contentOpacity={props.contentOpacity}
                  setStep={(value: number, values: any) => {
                    setStep(6);
                  }}
                />
              )}
              {step == 5 && (
                <OtpForm
                  contentOpacity={props.contentOpacity}
                  title="Create Account"
                  userPhone={data.phone}
                  goBack={() => setStep(4)}
                  setStep={(value: string) => setStep(6)}
                />
              )}
              {step == 6 && (
                <PersonalInfoForm
                  contentOpacity={props.contentOpacity}
                  setStep={values => {
                    setData({ ...data, ...values });
                    onSubmit({ ...data, ...values }, otp);
                  }}
                />
              )}
              {step == 7 && (
                <SLoader
                  contentOpacity={props.contentOpacity}
                  title={
                    route.params?.type == 'login'
                      ? 'Loggin In'
                      : 'Creating Account'
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
                  contentOpacity={props.contentOpacity}
                  isSuccess={true}
                  onPress={() => navigation.navigate('DSetup')}
                  onSkip={async () => {
                    userStore.userData.set(
                      JSON.parse(
                        JSON.stringify(userStore.currentRegisterUser.get()),
                      ),
                    );
                    navigation.navigate('HomeBottomTab');
                  }}
                  btnText={'Connect Device'}
                  title="Account setup complete"
                  message={`Lets setup your device now.`}
                  points={[
                    'Power on your device',
                    'Turn on bluetooth',
                    'Turn on location',
                  ]}
                />
              )}
            </>
          );
        }}
      </Wrapper>
    </>
  );
}
