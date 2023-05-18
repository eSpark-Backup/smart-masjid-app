import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import {
  LoginForm,
  OtpForm,
  SignUpForm,
  PersonalInfoForm,
  AddPhoneForm,
} from '../../forms';
import { RootStackParamList } from '../../types';
import { GapView, MyText, MyToast, OverlayLoader, SLoader } from '../../components';
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
import Toast from 'react-native-toast-message';
import { Check } from '../../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'USetup'>;

export default function UserSetupScreen() {
  const navigation = useNavigation<Props['navigation']>();
  const phoneId = useHookstate(globalStore.phoneId).get();
  const isDeviceRegistered = useHookstate(globalStore.isDeviceRegistered).get();
  const fcmToken = useHookstate(globalStore.fcmToken).get();
  const route = useRoute<Props['route']>();
  const [step, setStep] = useState(8);
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [data, setData] = useState<CreateUserRequest>({
    firstName: 'string',
    lastName: 'string',
    userType: 'Customer',
  });

  useEffect(() => {
    // if (route.params?.type == 'setup') {
    //   setStep(2);
    // } else {
    //   setStep(1);
    // }
  }, [route.params?.type]);

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
    setStep(7);
    const res: UserResponse | undefined | any = await CreateUser(dataObj);
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
      });
    }
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
      navigation.navigate('HomeBottomTab'); //TODO: Change it later
      // navigation.navigate('DSetup');
    }
  };

  return (
    <>
      <OverlayLoader isShow={loader} />
      <Wrapper
        bgImageSpacer={false}
        onBackPress={() => !disable && setStep(handleBack)}>
        <ScrollView>
          {step == 1 && (
            <LoginForm
              type={route.params?.type}
              onPhonePress={value => setStep(value)}
              setStep={values => {
                onLogin(values.email?.toLowerCase(), values.phone);
              }}
            />
          )}
          {step == 2 && (
            <SignUpForm
              onEmailPress={value => setStep(value)}
              type={route.params?.type}
              setStep={values => {
                setData({ ...data, email: values.email?.toLowerCase() });
                setStep(4);
              }}
            />
          )}
          {step == 3 && (
            <OtpForm
              title="Create Account"
              type={route.params?.type}
              setStep={(value: number) => setStep(4)}
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
              setStep={(value: number) => setStep(6)}
            />
          )}
          {step == 6 && (
            <PersonalInfoForm
              setStep={values => {
                setData({ ...data, ...values });
                onSubmit({ ...data, ...values });
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
              message={
                <>
                  <MyText text={`Lets setup your device`} size={16} />
                  <GapView length={25} />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Check height={15} width={15} />
                    <GapView length={5} mode='horizontal' />
                    <MyText text={`Power on your device`} size={16} />
                  </View>
                  <GapView />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Check height={15} width={15} />
                    <GapView length={5} mode='horizontal' />
                    <MyText text={`Turn on bluetooth on your phone`} size={16} />
                  </View>
                </>
              }
            />
          )}
        </ScrollView>
      </Wrapper>
    </>
  );
}

const styles = StyleSheet.create({});
