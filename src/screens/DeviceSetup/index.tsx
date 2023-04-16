import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Peripheral } from 'react-native-ble-manager';

import { userStore } from '../../store/UserStore';
import { Wrapper } from '../../containers';
import {
  DeviceSelectForm,
  WifiSelectForm,
  PasswordForm,
  DeviceNicknameForm,
} from '../../forms';
import {
  BottomNavigationParamList,
  DeviceInfo,
  RootStackParamList,
} from '../../types';
import { DLoader, MyToast, SLoader } from '../../components';
import { _requestBlePermissions } from '../../utils/functions';
import {
  _connectBleDevice,
  _disconnectBleDevice,
  _readFromDevice,
  _scanBleDevices,
  _startBluetooth,
  _writeToDevice,
} from './utils/functions';
import { _saveDevice, _saveDeviceToUser } from '../../api/deviceController';

type DSetupNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'DSetup'
>;

export default function DeviceSetupScreen() {
  console.log('User ka bta id mili ha?', userStore.get()?.userData?.id);
  const navigation: any = useNavigation<DSetupNavigationProps['navigation']>();
  const route: any = useRoute();
  const isFocused = useIsFocused();
  const [step, setStep] = useState(1);
  const [devInfo, setDevInfo] = useState<DeviceInfo>({});
  const [scannedDevices, setScannedDevices] = useState<
    Array<Peripheral | undefined>
  >([]);
  const [disable, setDisable] = useState(false);
  const [connFlag, setConnFlag] = useState(true);
  const [toastContent, setToastContent] = useState<{
    title?: string;
    message?: string;
    btnText?: string;
    onPress?: () => void;
  }>({
    title: undefined,
    message: undefined,
    btnText: undefined,
    onPress: () => setStep(2),
  });

  useEffect(() => {
    setStep(1);
    handlePermissions();
    setConnFlag(true);
  }, [isFocused]);

  useEffect(() => {
    return () => {
      _disconnectBleDevice(devInfo);
    };
  }, []);

  useEffect(() => {
    console.log('milgaya parent ko', devInfo);
  }, [devInfo]);

  useEffect(() => {
    console.log('step current?', step);
    if (step === 6) {
      handleDeviceSetup();
    }
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

  const handleDeviceSetup = async () => {
    if (!connFlag) {
      return;
    }
    const res = await _connectBleDevice(devInfo);
    console.log('kia ha peripherial info', res);
    setConnFlag(false);
    const stringData = await _readFromDevice(
      devInfo,
      '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      '6e400010-b5a3-f393-e0a9-e50e24dcca9e',
    );
    console.log('kia ha data', stringData);
    const jsonData = JSON.parse(stringData);
    setDevInfo(state => ({ ...state, ...jsonData }));

    await _writeToDevice(
      devInfo,
      '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      '6e400011-b5a3-f393-e0a9-e50e24dcca9e',
    );
    const response = await _scanBleDevices(5);
    if (
      response.some(item => {
        item?.id === devInfo?.macId;
      })
    ) {
      setStep(8);
    } else {
      await registerDevice({ ...devInfo, ...jsonData });
    }
  };

  const registerDevice = async (deviceInfo: DeviceInfo) => {
    const devRes: any = await _saveDevice(deviceInfo);
    const userDevRes = await _saveDeviceToUser(devRes?.id);
    if (userDevRes) {
      setStep(7);
    } else {
      setStep(8);
    }
  };

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
      return;
    } else {
      await _startBluetooth();
      const res = await _scanBleDevices();
      console.log('devices found', res.length);
      const newArr = res.filter(item => {
        if (item.name?.includes('MYESP32')) {
          return item;
        }
      });
      console.log('ESP devices found', newArr);
      setScannedDevices(newArr);
      setStep(2);
    }
  };

  return (
    <Wrapper onBackPress={() => !disable && setStep(handleBack)}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {step == 1 && <DLoader />}
        {step == 2 && (
          <DeviceSelectForm
            data={scannedDevices}
            setStep={(value: number) => setStep(value)}
            setDevMacId={(value?: string) =>
              setDevInfo(state => ({ ...state, macId: value }))
            }
          />
        )}
        {step == 3 && (
          <DeviceNicknameForm
            setNickName={(value: string) =>
              setDevInfo(state => ({ ...state, nickName: value }))
            }
            setStep={(value: number) => setStep(value)}
          />
        )}
        {step == 4 && (
          <WifiSelectForm
            setSSID={(value: string) =>
              setDevInfo(state => ({ ...state, ssid: value }))
            }
            setStep={(value: number) => setStep(value)}
          />
        )}
        {step == 5 && (
          <PasswordForm
            setPass={(value: string) =>
              setDevInfo(state => ({ ...state, password: value }))
            }
            ssid={devInfo?.ssid}
            setStep={(value: number) => setStep(value)}
          />
        )}
        {step == 6 && (
          <SLoader
            title="Setting Up Device"
            message="Connecting to wifi network..."
          />
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
