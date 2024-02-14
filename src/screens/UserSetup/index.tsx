import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { State, useHookstate } from '@hookstate/core';
import crashlytics from '@react-native-firebase/crashlytics';

import { Wrapper } from '../../containers';
import {
  LoginForm,
  SignUpForm,
  OtpForm,
  PersonalInfoForm,
  AddPhoneForm,
} from './UserForms';
import { GlobalProps, RootStackParamList } from '../../types';
import { MyToast, OverlayLoader, SLoader } from '../../components';
import {
  RegisterUserPhone,
  UpdateUserLogin,
  updateUserPhone,
} from '../../api/userController';
import {
  CreateUserRequest,
  UserPhone,
  UserResponse,
} from '../../types/userControllerApiResponse';
import { globalStore } from '../../store/GlobalStates';
import { _getFCMToken, setDataInLocalStorage } from '../../utils/functions';
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
  const state: State<GlobalProps> = useHookstate(globalStore);
  const navigation = useNavigation<Props['navigation']>();
  const phoneId = useHookstate(globalStore.phoneId).get();
  const devSetup = useHookstate(globalStore.devSetup);
  const userData = useHookstate(userStore.userData);
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
    console.log('onsubmit otp', otp);

    try {
      setStep(7);
      const res: UserResponse | undefined | any = await CreateUser(
        dataObj,
        otp,
      );
      console.log('res', res);
      if (res?.id && phoneId) {
        const registerPhoneRes = await RegisterUserPhone(
          { deviceId: phoneId, fcmToken: fcmToken as string },
          res?.id.toString(),
        );
        if (registerPhoneRes?.ok) {
          const login: any = await UpdateUserLogin(phoneId, res?.id);
          if (login?.ok) {
            setStep(8); //TODO: Change it later
          } else {
            setStep(6);
            Toast.show({
              text2: login?.message ?? 'Something went wrong',
              type: 'error',
              autoHide: true,
              visibilityTime: 10000,
            });
          }
        } else {
          setStep(6);
          Toast.show({
            text2: registerPhoneRes?.message ?? 'Something went wrong',
            type: 'error',
            autoHide: true,
            visibilityTime: 10000,
          });
        }
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

  const checkUserDeviceExist = (
    userPhone: UserPhone[],
    type: 'dev' | 'devAndFcm',
  ) => {
    if (type == 'dev') {
      return userPhone.some(
        ({ deviceId }: { deviceId: string }) => deviceId == phoneId,
      );
    } else if (type == 'devAndFcm') {
      return userPhone.some(
        (info: any) => info.deviceId == phoneId && info.fcmToken == fcmToken,
      );
    }
  };

  const onLogin = async (email: string, phone: string, OTPvalue: string) => {
    try {
      const res: UserResponse = await LoginUser(email, phone, OTPvalue);
      if (
        res?.id &&
        phoneId &&
        checkUserDeviceExist(res?.userPhone, 'devAndFcm')
      ) {
        navigation.navigate('HomeBottomTab'); //TODO: Change it later
        state.globalLoading.set(false);
        // setLoader(false);
      } else if (
        res?.id &&
        phoneId &&
        !checkUserDeviceExist(res?.userPhone, 'dev')
      ) {
        const registerPhoneRes = await RegisterUserPhone(
          { deviceId: phoneId, fcmToken: fcmToken as string },
          res?.id.toString(),
        );
        if (registerPhoneRes?.ok) {
          const login: any = await UpdateUserLogin(phoneId, res?.id);
          if (login?.ok) {
            navigation.navigate('HomeBottomTab'); //TODO: Change it later
          } else {
            state.globalLoading.set(false);
            // setLoader(false);
          }
        } else {
          state.globalLoading.set(false);
          // setLoader(false);
        }
      } else if (
        res?.id &&
        phoneId &&
        !checkUserDeviceExist(res?.userPhone, 'devAndFcm')
      ) {
        const updatePhoneRes = await updateUserPhone(
          fcmToken as string,
          res?.id.toString(),
          phoneId,
        );
        if (updatePhoneRes?.ok) {
          const login: any = await UpdateUserLogin(phoneId, res?.id);
          if (login?.ok) {
            navigation.navigate('HomeBottomTab'); //TODO: Change it later
          } else {
            state.globalLoading.set(false);
            // setLoader(false);
          }
        } else {
          state.globalLoading.set(false);
          // setLoader(false);
        }
      } else {
        state.globalLoading.set(false);
        // setLoader(false);
      }
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
      state.globalLoading.set(true);
      // setLoader(true);
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
            if (phone) {
              setData({ ...data, phone: phone ?? '' });
            } else {
              setData({ ...data, email: email ?? '', phone: phone ?? '' });
            }
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
      state.globalLoading.set(false);
      // setLoader(false);
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  console.log('data', data);

  return (
    <>
      {/* <OverlayLoader isShow={loader} /> */}
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
                  userPhone={data.phone}
                  setStep={async (value: string) => {
                    state.globalLoading.set(true);
                    // setLoader(true);
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
                        state.globalLoading.set(false);
                        // setLoader(false);
                      } else {
                        setOTP(value);
                        onLogin(
                          data?.email?.toLowerCase() ?? '',
                          data.phone ?? '',
                          value,
                        );
                      }
                    } else {
                      state.globalLoading.set(false);
                      // setLoader(false);
                    }
                  }}
                  goBack={() =>
                    activeFlow == 'signup' ? setStep(2) : setStep(1)
                  }
                  onResend={async () => {
                    await SendOTP(data.email ?? '', data.phone ?? '');
                  }}
                />
              )}
              {step == 4 && (
                <AddPhoneForm
                  contentOpacity={props.contentOpacity}
                  setStep={async (value: number, values: any) => {
                    if (value == 5) {
                      console.log('phoneNumber', values);
                      const result = await SendOTP('', values.phone);
                      if (result) {
                        if (values.phone) {
                          setData({ ...data, phone: values.phone ?? '' });
                        }
                        setStep(value);
                      }
                    } else {
                      setData({ ...data, phone: '' });
                      setStep(value);
                    }
                  }}
                />
              )}
              {step == 5 && (
                <OtpForm
                  contentOpacity={props.contentOpacity}
                  title="Create Account"
                  userPhone={data.phone}
                  goBack={() => setStep(4)}
                  setStep={async (value: string) => {
                    state.globalLoading.set(true);
                    // setLoader(true);
                    const isVerified = await ValidateOTP(
                      value,
                      data.email ?? '',
                      data.phone ?? '',
                    );
                    console.log('isVerified', isVerified);
                    if (isVerified) {
                      setStep(6);
                      state.globalLoading.set(false);
                      // setLoader(false);
                    }
                    state.globalLoading.set(false);
                    // setLoader(false);
                  }}
                  onResend={async () => {
                    await SendOTP('', data.phone ?? '');
                  }}
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
                  onPress={() => {
                    devSetup.set(true);
                    userData.set(
                      JSON.parse(
                        JSON.stringify(userStore.currentRegisterUser.get()),
                      ),
                    );
                    setDataInLocalStorage(
                      'user',
                      JSON.stringify(userStore.currentRegisterUser.get()),
                    );
                  }}
                  onSkip={async () => {
                    userData.set(
                      JSON.parse(
                        JSON.stringify(userStore.currentRegisterUser.get()),
                      ),
                    );
                    setDataInLocalStorage(
                      'user',
                      JSON.stringify(userStore.currentRegisterUser.get()),
                    );
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
