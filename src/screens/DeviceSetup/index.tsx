import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, ScrollView, Text } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Peripheral } from 'react-native-ble-manager';
import jwtDecode from 'jwt-decode';

//@ts-ignore
import RNSettings from 'react-native-settings';

import { userStore } from '../../store/UserStore';
import { Wrapper } from '../../containers';
import {
  DeviceSelectForm,
  WifiSelectForm,
  PasswordForm,
  DeviceNicknameForm,
} from './DeviceForms';
import {
  BottomNavigationParamList,
  DeviceInfo,
  RootStackParamList,
} from '../../types';
import { DLoader, MyText, MyToast, SLoader } from '../../components';
import {
  _checkBleStatus,
  _checkLocationStatus,
  _connectBleDevice,
  _disconnectBleDevice,
  _readFromDevice,
  _scanBleDevices,
  _startBluetooth,
  _startCheckBle,
  _startLocationCheck,
  _stopLocationCheck,
  _writeToDevice,
} from './utils/functions';
import {
  _checkDeviceTelemetry,
  _resetDevice,
  _saveDevice,
  _saveDeviceBtnToMasjid,
  _saveDeviceToUser,
  _updateDevice,
} from '../../api/deviceController';
import { _checkDeviceExists } from '../../api/externalControllers';
import { useUpdateEffect, _requestBlePermissions } from '../../utils';
import { UserToken } from '../../types/userControllerApiResponse';

type DSetupNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'DSetup'
>;

export default function DeviceSetupScreen() {
  // console.log('User ka bta id mili ha?', userStore.get());

  const navigation: any = useNavigation<DSetupNavigationProps['navigation']>();
  const route: any = useRoute();
  const isFocused = useIsFocused();
  const [bleStatus, setBleStatus] = useState<boolean | undefined>();
  const [locationStatus, setlocationStatus] = useState<boolean | undefined>();
  const [retry, setRetry] = useState<boolean>();
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
    points?: string[];
  }>({
    title: undefined,
    message: undefined,
    btnText: undefined,
    onPress: () => {
      setStep(1);
      setRetry(true);
    },
  });

  useEffect(() => {
    return () => {
      _disconnectBleDevice(devInfo);
    };
  }, []);

  useEffect(() => {
    if (retry) {
      setStep(1);
      setConnFlag(true);
      handlePermissions();
      setRetry(false);
    }
  }, [retry]);

  // useEffect(() => {
  //   console.log('milgaya parent ko', devInfo);
  // }, [devInfo]);

  useEffect(() => {
    console.log('step current?', step);
    if (step === 6) {
      handleDeviceSetup();
    }
  }, [step]);

  useEffect(() => {
    checkStatus();
    _startLocationCheck(_handleGPSProviderEvent);
    _startCheckBle(_handleBleStateEvent);
    return () => {
      _stopLocationCheck();
    };
  }, [isFocused]);

  useUpdateEffect(() => {
    if (locationStatus === false) {
      setStep(8);
      setToastContent({
        message: 'Enable Location',
        onPress: () => {
          setRetry(true);
        },
        points: [],
      });
    }
    if (bleStatus === false) {
      setStep(8);
      setToastContent({
        message: 'Enable Ble Adapter',
        onPress: () => {
          setRetry(true);
        },
        points: [],
      });
    }
  }, [locationStatus, bleStatus]);

  function _handleGPSProviderEvent(e: any) {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      setlocationStatus(false);
    } else {
      setlocationStatus(true);
    }
  }

  function _handleBleStateEvent(e: any) {
    console.log('bta ble state', e);
    if (e === 'PoweredOn') {
      setBleStatus(true);
    }
    if (e === 'PoweredOff') {
      setBleStatus(false);
    }
  }

  const checkStatus = async () => {
    const ble = await _checkBleStatus();
    const loc = await _checkLocationStatus();
    setBleStatus(ble);
    setlocationStatus(loc);
    setStep(1);
    setConnFlag(true);
    await handlePermissions(ble, loc);
  };

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
    console.log('xxxxx======>>>>>', devInfo);
    if (!connFlag) {
      return;
    }
    try {
      const res = await _connectBleDevice(devInfo);
      console.log('kia ha peripherial info', res);
      setConnFlag(false);
      const stringData = await _readFromDevice(
        devInfo,
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400010-b5a3-f393-e0a9-e50e24dcca9e',
      );
      console.log('kia ha data >>>>>>>', stringData);
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
        console.log(
          'xxxxxxxxxxxxx Device was Scanned Again! Not connected xxxxxxxxxxxxx',
        );
        setStep(8);
      } else {
        await registerDevice({ ...devInfo, ...jsonData });
      }
    } catch (e) {
      setStep(8);
      console.log('error while ble connect', e);
      setToastContent({
        title: 'Device not connected',
        btnText: 'Try Again',
        message: 'Ble device not connected Sucessfully',
        onPress: () => {
          setRetry(true);
        },
        points: ['Check your device'],
      });
    }
  };

  const registerDevice = async (deviceInfo: DeviceInfo) => {
    const dev = scannedDevices.find(item => item?.id === deviceInfo?.macId);
    const isBtn = dev?.name?.includes('SMBTN');
    if (route?.params?.from != 'SelectedDevice') {
      const devRes: any = await _saveDevice(deviceInfo);
      if (isBtn) {
        console.log('-> Detected Smart Button');
        const USER_TOKEN: any = userStore.get().token;
        const jwtDecodedObj: UserToken = jwtDecode(USER_TOKEN);
        console.log(
          'kia ha decoded string========??????',
          JSON.stringify(jwtDecodedObj),
        );
        const masjidDevRes: any = await _saveDeviceBtnToMasjid(
          devRes?.id,
          jwtDecodedObj.masjidId,
        );
        console.log('kia res???', masjidDevRes);
        if (masjidDevRes) {
          setTimeout(() => {
            checkTelemetry(masjidDevRes?.id.toString()); // check Telemetery masjidDevice
          }, 5000);
        } else {
          setStep(8); // failed saving device (show error screen)
        }
      } else {
        console.log('-> Detected Smart Speaker');
        const userDevRes: any = await _saveDeviceToUser(devRes?.id);
        console.log('kia res???', userDevRes);
        if (userDevRes) {
          setTimeout(() => {
            checkTelemetry(userDevRes?.id.toString()); // check Telemetery for userDevice
          }, 5000);
        } else {
          setStep(8); // failed saving device (show error screen)
        }
      }
    } else {
      const devRes: any = await _updateDevice({
        ...route?.params?.deviceData,
        wifiSsid: devInfo.ssid,
      });
      if (devRes) {
        setTimeout(() => {
          checkTelemetry(route?.params?.deviceData?.id.toString()); // check Telemetery for userDevice
        }, 5000);
      }
    }
  };

  const checkTelemetry = async (deviceId: string) => {
    try {
      const res = await _checkDeviceTelemetry(deviceId);
      if (Boolean(res)) {
        setStep(7); // successfully device added and found it out as well
      } else {
        handleDeleteDevice(deviceId); //FIXME: uncomment later
      }
    } catch (e) {
      console.log('error on call check device telemetry', e);
      setStep(8);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const res = await _resetDevice(deviceId);
      console.log('kia mila delte pr', res);
      if (Boolean(res)) {
        setStep(8); // successfully device added and found it out as well
      } else {
        setStep(8); // telemetry is in the negative (device not added sucessfully)
      }
    } catch (e) {
      console.log('error on delete device', e);
      setStep(8);
    }
  };

  const handlePermissions = async (ble?: boolean, location?: boolean) => {
    const status = await _requestBlePermissions();
    const bleCheck = ble ?? bleStatus;
    const locationCheck = location ?? locationStatus;
    console.log('Permission of Ble Status', status);
    if (!status) {
      setStep(8);
      setToastContent({
        title: 'Accept Permissions',
        message: 'Accept All Permission to Continue to Scan for BLE devices',
        onPress: () => {
          setRetry(true);
        },
        points: ['Allow Permissions', 'Manually from "App Settings"'],
      });
      return;
    }
    if (bleCheck && locationCheck) {
      await _startBluetooth();
      const res = await _scanBleDevices();
      console.log('devices found', res.length);
      const newArr = res.filter(item => {
        if (item.name?.includes('SMBTN') || item.name?.includes('SMSPK')) {
          return item;
        }
      });
      console.log('ESP devices found', JSON.stringify(newArr));
      setScannedDevices(newArr);
      if (newArr.length === 0) {
        setStep(8);
        setToastContent(state => ({
          ...state,
          message: 'Please check: ',
          points: [
            'Device is powered on',
            'Bluetooth on your phone is turned on',
            'Device LED is blinking yellow',
          ],
          onPress: () => {
            setRetry(true);
          },
        }));
      } else {
        if (!bleCheck || !locationCheck) {
          setStep(8);
        } else {
          setStep(2);
        }
      }
    } else {
      if (locationStatus === false || bleStatus === false) {
        setStep(8);
        setToastContent(state => ({
          ...state,
          message: 'Please Check',
          onPress: () => setRetry(true),
          points: ['Location Enabled on Phone', 'Bluetooth Enabled on Phone'],
        }));
      }
    }
  };

  console.log('Deviceinfo', devInfo);

  return (
    <Wrapper
      bgImageSpacer={false}
      showBack={disable}
      onBackPress={() => disable && setStep(handleBack)}>
      {({ props }) => {
        return (
          <ScrollView
            nestedScrollEnabled
            contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}>
            {step == 1 && <DLoader contentOpacity={props.contentOpacity} />}
            {step == 2 && (
              <DeviceSelectForm
                contentOpacity={props.contentOpacity}
                userInfo={
                  userStore.get().currentRegisterUser
                    ? userStore.get().currentRegisterUser?.userType.name
                    : userStore.get().userData?.userType.name
                }
                data={scannedDevices}
                setStep={(value: number) => setStep(value)}
                setDevMacId={(value?: string) =>
                  setDevInfo(state => ({ ...state, macId: value }))
                }
                selectedDeviceData={route?.params?.deviceData}
                autoSelect={route?.params?.from == 'SelectedDevice'}
              />
            )}
            {step == 3 && (
              <DeviceNicknameForm
                contentOpacity={props.contentOpacity}
                setNickName={(value: string) =>
                  setDevInfo(state => ({ ...state, nickName: value }))
                }
                setStep={(value: number) => setStep(value)}
                currentDeviceName={route?.params?.deviceData?.name}
                autoFillName={route?.params?.from == 'SelectedDevice'}
              />
            )}
            {step == 4 && (
              <WifiSelectForm
                contentOpacity={props.contentOpacity}
                setSSID={(value: string) =>
                  setDevInfo(state => ({ ...state, ssid: value }))
                }
                setStep={(value: number) => setStep(value)}
                currentWifiSSID={route?.params?.deviceData?.wifiSsid}
                autoSelect={route?.params?.onlyPassword}
              />
            )}
            {step == 5 && (
              <PasswordForm
                contentOpacity={props.contentOpacity}
                setPass={(value: string) =>
                  setDevInfo(state => ({ ...state, password: value }))
                }
                ssid={devInfo?.ssid}
                setStep={(value: number) => setStep(value)}
              />
            )}
            {step == 6 && (
              <SLoader
                title="Device Setup"
                contentOpacity={props.contentOpacity}
                subtitle="Setting up your device"
                message="Do not close the app till setup is complete."
              />
            )}
            {step == 7 && (
              <MyToast
                contentOpacity={props.contentOpacity}
                heading="Device Setup"
                isSuccess={true}
                btnText={route.params?.from ? 'Done' : 'Search Masjid'}
                onPress={() => {
                  if (userStore.currentRegisterUser.get()) {
                    userStore.userData.set(userStore.currentRegisterUser.get());
                  }
                  navigation.navigate('HomeBottomTab', {
                    screen: route.params?.from ? 'Device' : 'Home',
                  });
                }}
                title="Device connected successfully"
                message={'Let’s subscribe to a masjid now.' + masjidSetupText}
                center
              />
            )}
            {step == 8 && (
              <MyToast
                contentOpacity={props.contentOpacity}
                heading="Device Setup"
                titleSize={16}
                isSuccess={false}
                btnText={toastContent.btnText ?? 'Try Again'}
                onPress={toastContent.onPress}
                title={toastContent.title ?? 'Oops! Device not found.'}
                message={toastContent.message ?? 'Please check:'}
                points={
                  toastContent.points ?? [
                    'Device is powered on',
                    'Bluetooth on your phone is turned on',
                    'Device LED is blinking yellow',
                  ]
                }
              />
            )}
          </ScrollView>
        );
      }}
    </Wrapper>
  );
}
