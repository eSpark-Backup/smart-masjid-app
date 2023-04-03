import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { EmailForm, OtpForm, PhoneForm, PersonalInfoForm } from '../../forms';
import { RootStackParamList } from '../../types';
import { MyToast, OverlayLoader, SLoader } from '../../components';
import {
  CreateUser,
  LoginUser,
  RegisterUserPhone,
} from '../../api/userController';
import {
  CreateUserRequest,
  UserResponse,
} from '../../types/userControllerApiResponse';
import { useHookstate } from '@hookstate/core';
import { globalStore } from '../../store/GlobalStates';
import { _getFCMToken } from '../../utils/functions';

type Props = NativeStackScreenProps<RootStackParamList, 'USetup'>;

export default function UserSetupScreen() {
  const navigation = useNavigation<Props['navigation']>();
  const phoneId = useHookstate(globalStore.phoneId).get();
  const isDeviceRegistered = useHookstate(globalStore.isDeviceRegistered).get();
  const fcmToken = useHookstate(globalStore.fcmToken).get();
  const route = useRoute<Props['route']>();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [data, setData] = useState<CreateUserRequest>({
    firstName: 'string',
    lastName: 'string',
    userType: 'Customer',
  });

  useEffect(() => {
    if (step == 4) {
      setTimeout(() => {
        setStep(step + 1);
      }, 3000);
    }
  }, [step]);

  const handleBack = () => {
    if (step == 1.1) {
      return 1;
    }
    if (step !== 1) {
      return step - 1;
    }
    navigation.goBack();
    return 1;
  };

  const onSubmit = async (dataObj: CreateUserRequest) => {
    setStep(4);
    const res: UserResponse | undefined = await CreateUser(dataObj);
    if (res?.id && phoneId) {
      await RegisterUserPhone(
        { deviceId: phoneId, fcmToken: fcmToken as string },
        res?.id.toString(),
      );
    }
    setStep(5);
  };

  const onLogin = async (email: string, phone: string) => {
    setLoader(true);
    const res = await LoginUser(email, phone);
    setLoader(false);

    if (res?.id && phoneId && !isDeviceRegistered) {
      await RegisterUserPhone(
        { deviceId: phoneId, fcmToken: fcmToken as string },
        res?.id.toString(),
      );
    }
    
    if (res?.id) {
      navigation.navigate('HomeBottomTab');
    }
  };

  return (
    <>
      <OverlayLoader isShow={loader} />
      <Wrapper onBackPress={() => !disable && setStep(handleBack)}>
        <ScrollView>
          {step == 1 && (
            <EmailForm
              type={route.params?.type}
              onPhonePress={value => setStep(value)}
              setStep={values => {
                if (route.params?.type == 'setup') {
                  setData({ ...data, ...values });
                  setStep(3);
                } else {
                  onLogin(values.email, '');
                }
              }}
            />
          )}
          {step == 1.1 && (
            <PhoneForm
              onEmailPress={value => setStep(value)}
              type={route.params?.type}
              setStep={values => {
                if (route.params?.type == 'setup') {
                  setData({ ...data, ...values });
                  setStep(3);
                } else {
                  onLogin('', values.phone);
                }
              }}
            />
          )}
          {step == 2 && (
            <OtpForm
              type={route.params?.type}
              setStep={(value: number) => setStep(value)}
            />
          )}
          {step == 3 && (
            <PersonalInfoForm
              setStep={values => {
                setData({ ...data, ...values });
                onSubmit({ ...data, ...values });
              }}
            />
          )}
          {step == 4 && (
            <SLoader
              title={
                route.params?.type == 'login' ? 'Loggin In' : 'Creating Account'
              }
              message={
                route.params?.type == 'login'
                  ? 'Logging into the System.'
                  : 'Your account will be ready soon.'
              }
            />
          )}
          {step == 5 && (
            <MyToast
              isSuccess={true}
              onPress={() => navigation.navigate('DSetup')}
              btnText={'Connect Device'}
              title="You’re all set!"
              message={
                'Lets setup your device.' +
                '\n' +
                '\n' +
                'Make sure you power on your device and turn on bluetooth on your phone.'
              }
            />
          )}
        </ScrollView>
      </Wrapper>
    </>
  );
}

const styles = StyleSheet.create({});
