import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import {
  DeviceSelectForm,
  WifiSelectForm,
  PasswordForm,
  DeviceNicknameForm,
} from '../../forms';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { DLoader, MyToast, SLoader } from '../../components';
import { _startBluetooth } from './utils/functions';
import { _requestBlePermissions } from '../../utils/functions';

type DSetupNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'DSetup'
>;

export default function DeviceSetupScreen() {
  const navigation: any = useNavigation<DSetupNavigationProps['navigation']>();
  const route: any = useRoute();
  const isFocused = useIsFocused();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);
  const [toastContent, setToastContent] = useState<{
    title?: string;
    message?: string;
    btnText?: string;
    onPress?: () => void;
  }>({
    title: '',
    message: '',
    btnText: '',
    onPress: () => setStep(2),
  });

  const handlePermissions = async () => {
    const status = await _requestBlePermissions();
    console.log(status);
    if (!status) {
      setStep(8);
      setToastContent({
        title: 'Accept Permissions',
        message: 'Accept All Permission to Continue to Scan for BLE devices',
        onPress: () => {
          handlePermissions();
          setStep(1);
        },
      });
    }
  };

  useEffect(() => {
    setStep(1);
    handlePermissions();
    // _startBluetooth();
  }, [isFocused]);

  useEffect(() => {
    console.log('step current?', step);
    // if (step == 1) {
    //   setTimeout(() => {
    //     setStep(step + 1);
    //   }, 3000);
    // }
  }, [step]);

  const handleBack = () => {
    if (step !== 1) {
      return step - 1;
    }
    return 1;
  };

  const masjidSetupText = !route?.params?.from
    ? '\n \nLets subscribe to a masjid now.'
    : '';

  return (
    <Wrapper onBackPress={() => !disable && setStep(handleBack)}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {step == 1 && <DLoader />}
        {step == 2 && (
          <DeviceSelectForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 3 && (
          <DeviceNicknameForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 4 && (
          <WifiSelectForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 5 && (
          <PasswordForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 6 && (
          <SLoader title="Connecting" message="Connecting to wifi network" />
        )}
        {step == 7 && (
          <MyToast
            isSuccess={true}
            btnText={route.params?.from ? 'Awesome' : 'Search Masjid'}
            onPress={() =>
              navigation.navigate('HomeBottomTab', {
                screen: route.params?.from ? 'Device' : 'Home',
              })
            }
            title="Device setup complete!"
            message={'Your device is connected successfully.' + masjidSetupText}
          />
        )}
        {step == 8 && (
          <MyToast
            isSuccess={true}
            btnText={toastContent.btnText ?? 'Try Again'}
            onPress={toastContent.onPress}
            title={toastContent.title ?? 'Oops! Device not found.'}
            message={
              toastContent.message ??
              `Please make sure your device and\nyour phone Bluetooth is turned ON.\n \nAlso check if the device LED is\nblinking yellow.
          `
            }
          />
        )}
      </ScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
