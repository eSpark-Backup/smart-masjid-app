import React, { useEffect, useState, useRef } from 'react';
import {
  BackHandler,
  NativeModules,
  NativeEventEmitter,
  Platform,
  View,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Peripheral } from 'react-native-ble-manager';
import jwtDecode from 'jwt-decode';
import crashlytics from '@react-native-firebase/crashlytics';

//@ts-ignore
import RNSettings from 'react-native-settings';
import moment from 'moment';

import { userStore } from '../../store/UserStore';
import { Wrapper } from '../../containers';
import {
  // WifiSelectForm,
  PasswordForm,
  // DeviceNicknameForm,
} from './DeviceForms';
import WifiSelectForm from '../../forms/WifiSelectForm';
import DeviceNicknameForm from '../../forms/DeviceNicknameForm';
import DeviceSelectForm from '../../forms/DeviceSelectForm';
import {
  BottomNavigationParamList,
  DeviceInfo,
  RootStackParamList,
} from '../../types';
import { DLoader, MyToast, SLoader } from '../../components';
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
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function DeviceSetupScreen() {
  // console.log('User ka bta id mili ha?', userStore.get());

  let telemetryInterval: number;
  const navigation: any = useNavigation<DSetupNavigationProps['navigation']>();
  const route: any = useRoute();
  const isFocused = useIsFocused();
  const [bleStatus, setBleStatus] = useState<boolean | undefined>();
  const [locationStatus, setlocationStatus] = useState<boolean | undefined>();
  const [retry, setRetry] = useState<boolean>();
  const [step, setStep] = useState(
    route?.params?.deviceData?.deviceTelemetry?.status !== 'Online' ? 1 : 4,
  );
  const [devInfo, setDevInfo] = useState<DeviceInfo>({});
  const [issues, setIssues] = useState<string[]>([]);
  const [scannedDevices, setScannedDevices] = useState<
    Array<Peripheral | undefined>
  >([]);
  const [iosScannedData, setIosScannedData] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
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
    points: [],
  });

  const toastContentRef = useRef<string[]>([]);

  const backAction = () => {
    console.log('current flag', route?.params?.from);
    if (
      route.params.from === 'Device' ||
      route.params.from === 'SelectedDevice'
    ) {
      navigation.navigate('HomeBottomTab', {
        screen: 'Device',
      });
    }
    return true;
  };

  const addOrUpdatePeripheral = (peripheral: Peripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    if (peripheral?.name) {
      console.log('kia ha', peripheral);
      setIosScannedData(map => new Map(map.set(peripheral.id, peripheral)));
    }
  };

  useEffect(() => {
    console.log('xxx', Array.from(iosScannedData.values()));
  }, [iosScannedData.values()]);

  useEffect(() => {
    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        peripheral => addOrUpdatePeripheral(peripheral),
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', () =>
        console.log('scan stopped'),
      ),
    ];

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
      if (
        !toastContentRef.current?.some(
          (item: string) => item === 'Bluetooth permission denied',
        ) ||
        step !== 1
      ) {
        _disconnectBleDevice(
          devInfo,
          route?.params?.deviceData?.deviceTelemetry?.status === 'Online',
        );
      }
    };
  }, []);

  useEffect(() => {
    toastContentRef.current = toastContent.points as string[];
  }, [toastContent.points]);

  useEffect(() => {
    if (retry) {
      setStep(1);
      setConnFlag(true);
      handlePermissions();
      setRetry(false);
    }
  }, [retry]);

  useEffect(() => {
    console.log('step current?', step);
    if (step === 6) {
      if (route?.params?.deviceData?.deviceTelemetry?.status !== 'Online') {
        handleDeviceSetup();
      } else {
        setTimeout(() => {
          updateDevice();
        }, 5000);
      }
    }
    handleShowBack(step);
  }, [step]);

  useEffect(() => {}, []);

  useEffect(() => {
    checkStatus();
    _startLocationCheck(_handleGPSProviderEvent);
    if (route?.params?.deviceData?.deviceTelemetry?.status != 'Online') {
      _startCheckBle(_handleBleStateEvent);
    }
    return () => {
      _stopLocationCheck();
    };
  }, [isFocused]);

  useUpdateEffect(() => {
    if (locationStatus && bleStatus) {
      setIssues([]);
    }
    if (locationStatus === false) {
      setIssues(state => {
        return [...state, 'Location is turned off'];
      });
    }
    if (
      bleStatus === false &&
      route?.params?.deviceData?.deviceTelemetry?.status != 'Online'
    ) {
      setIssues(state => {
        return [...state, 'Bluetooth is turned off'];
      });
    }
  }, [locationStatus, bleStatus]);

  useUpdateEffect(() => {
    if (issues.length > 0) {
      setStep(8);
      setToastContent(state => ({
        ...state,
        title: 'Device setup error',
        message: 'Issues Found',
        onPress: () => {
          setRetry(true);
          setIssues([]);
        },
        points: [...new Set(issues)],
      }));
    }
  }, [issues]);

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
    const ble = Platform.OS == 'ios' ? true : await _checkBleStatus();
    const loc = await _checkLocationStatus();
    setBleStatus(ble);
    setlocationStatus(loc);
    if (
      route?.params?.from === 'SelectedDevice' &&
      route?.params?.deviceData?.deviceTelemetry?.status == 'Online'
    ) {
      setStep(4);
    } else {
      setStep(1); //todo: first 6 then 1
      setConnFlag(true);
      await handlePermissions(ble, loc);
    }
  };

  const handleShowBack = (currStep: number) => {
    console.log('parent?', route?.params?.from);
    switch (currStep) {
      case 2:
        if (route?.params?.from === 'Device') setDisable(true);
        break;
      case 3:
        setDisable(true);
        break;
      case 4:
        setDisable(true);
        break;
      case 5:
        setDisable(true);
        break;
      default:
        setDisable(false);
    }
  };

  const handleBack = () => {
    switch (step) {
      case 2:
        return navigation.goBack();
      case 3:
        return step - 1;
      case 4:
        return step - 1;
      case 5:
        return step - 1;
      default:
        return 1;
    }
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
        response?.some(item => {
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
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.log('error while ble connect', error);
      setStep(8);
      setToastContent(state => ({
        ...state,
        title: 'Device setup error',
        message: 'Please Check',
        points: [
          'Device is powered on',
          'Phone is within range of the device',
          'Device LED is yellow',
          'WiFi is working',
        ],
        onPress: () => {
          setRetry(true);
        },
      }));
    }
  };

  const updateDevice = async () => {
    console.log('devInfoxxxxxxxxx', devInfo);
    const devRes: any = await _updateDevice({
      ...route?.params?.deviceData,
      wifiSsid: devInfo.ssid,
      wifiPassword: devInfo.password,
    });
    if (devRes) {
      telemetryInterval = setInterval(() => {
        checkTelemetry(route?.params?.deviceData?.id.toString(), true); // check Telemetery for userDevice
      }, 10000);
    } else {
      setStep(8);
      setToastContent({
        title: undefined,
        message: undefined,
        btnText: undefined,
        onPress: () => {
          console.log('kia ha');
          navigation.navigate('HomeBottomTab', {
            screen: 'Device',
          });
        },
      });
    }
  };

  const registerDevice = async (deviceInfo: DeviceInfo) => {
    const dev = scannedDevices.find(item => item?.id === deviceInfo?.macId);
    const isBtn = dev?.name?.includes('SMBTN');
    const USER_TOKEN: any = userStore.get().token;
    const jwtDecodedObj: UserToken = jwtDecode(USER_TOKEN);
    if (jwtDecodedObj?.masjidId === 0 && jwtDecodedObj?.userType?.id == 2) {
      setStep(8); // gotten a falty masjid id
      console.log('gotten a faulty masjid id (0)');
    } else {
      if (route?.params?.from != 'SelectedDevice') {
        const devRes: any = await _saveDevice(deviceInfo);
        if (isBtn) {
          console.log('-> Detected Smart Button');
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
            telemetryInterval = setInterval(() => {
              checkTelemetry(masjidDevRes?.id.toString()); // check Telemetery masjidDevice
            }, 10000);
          } else {
            setStep(8); // failed saving device (show error screen)
          }
        } else {
          console.log('-> Detected Smart Speaker');
          const userDevRes: any = await _saveDeviceToUser(devRes?.id);
          console.log('kia res???', userDevRes);
          if (userDevRes) {
            telemetryInterval = setInterval(() => {
              checkTelemetry(userDevRes?.id.toString()); // check Telemetery for userDevice
            }, 10000);
          } else {
            setStep(8); // failed saving device (show error screen)
          }
        }
      } else {
        setTimeout(() => {
          updateDevice();
        }, 5000);
      }
    }
  };

  const validateUpdatedTime = (dateTime: string): boolean => {
    const utcDateString = dateTime; // get a date/time
    const timeNow = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // format the current time to the same format
    const utcTimeNow = moment.utc(timeNow);
    const differenceInMinutes = Math.abs(
      moment(utcDateString).diff(moment(utcTimeNow), 'minutes'),
    ); // check the difference in minutes: number
    console.log(
      'updatedTime:',
      utcDateString,
      '\n',
      'timeNow:',
      utcTimeNow,
      '\n',
      'Difference in Time:',
      differenceInMinutes,
    );

    return differenceInMinutes < 2 ? true : false;
  };

  let count = 0;
  const checkTelemetry = async (deviceId: string, checkTime?: boolean) => {
    // function should not run more than 3 times
    if (count >= 3) {
      count = 0;
      handleDeleteDevice(deviceId);
      clearInterval(telemetryInterval);
      return;
    } else {
      try {
        const res = await _checkDeviceTelemetry(deviceId, checkTime);
        if (Boolean(res)) {
          count = 0;
          clearInterval(telemetryInterval);
          if (checkTime) {
            console.log('kas', res);
            const isValid = validateUpdatedTime(res?.updatedTime);
            isValid
              ? setStep(7)
              : (setStep(8),
                setToastContent({
                  title: undefined,
                  message: undefined,
                  btnText: undefined,
                  onPress: () => {
                    // navigation.navigate('HomeBottomTab', {
                    //   screen: 'Device',
                    // });
                    setStep(4);
                  },
                }));
          } else {
            setStep(7); // successfully device added and found it out as well
          }
        } else {
          console.log('nhi mila telemetry');
        }
      } catch (error) {
        crashlytics().recordError(error as Error);
        console.log('error on call check device telemetry', error);
        clearInterval(telemetryInterval);
        handleDeleteDevice(deviceId);
      }
      count++;
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      setToastContent(state => ({
        ...state,
        title: 'Device setup error',
        message: 'Please Check',
        points: [
          'Device is powered on',
          'Phone is within range of the device',
          'Device LED is yellow',
          'WiFi is working',
        ],
        onPress: () => {
          setRetry(true);
        },
      }));
      const res = await _resetDevice(deviceId);
      console.log('kia mila delte pr', res);
      if (Boolean(res)) {
        setStep(8); // successfully device added and found it out as well
      } else {
        setStep(8); // telemetry is in the negative (device not added sucessfully)
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.log('error on delete device', error);
      setStep(8);
    }
  };

  const handlePermissions = async (ble?: boolean, location?: boolean) => {
    const status = await _requestBlePermissions();
    const bleCheck = ble ?? bleStatus;
    const locationCheck = location ?? locationStatus;
    console.log('Permission of Ble Status', status);
    if (!status) {
      // setStep(8);
      // setToastContent({
      //   title: 'Accept Permissions',
      //   message: 'Accept All Permission to Continue to Scan for BLE devices',
      //   onPress: () => {
      //     setRetry(true);
      //   },
      //   points: ['Allow Permissions', 'Manually from "App Settings"'],
      // });
      setIssues(state => {
        return [...state, 'Bluetooth permission denied'];
      });
    }
    if (bleCheck && locationCheck && status) {
      await _startBluetooth();
      setTimeout(async () => {
        const res = await _scanBleDevices();
        console.log('devices found', res?.length);
        const newArr = res?.filter(item => {
          if (item.name?.includes('SMBTN') || item.name?.includes('SMSPK')) {
            return item;
          }
        });
        console.log('ESP devices found', JSON.stringify(newArr));
        console.log(
          '====>>>>>',
          bleStatus,
          'loc xxx',
          locationStatus,
          new Set(issues),
        );
        setScannedDevices(newArr!);
        const macAdd = route?.params?.deviceData?.macAddress;
        const isFound = !newArr?.some(item =>
          macAdd ? item.id === macAdd : true,
        );
        if (issues.length === 0) {
          if (newArr?.length === 0 || isFound) {
            setStep(8);
            setToastContent(state => ({
              ...state,
              title: 'Device not Found',
              message: 'Please Check',
              points: [
                'Device is powered on',
                'Phone is within range of the device',
                'Device LED is yellow',
                'WiFi is working',
              ],
              onPress: () => {
                setRetry(true);
              },
            }));
          } else {
            console.log('====== step 2 jana chahta ha', iosScannedData);
            setStep(2);
          }
        }
      }, 100);
    } else {
      console.log('location off ha? ', locationStatus);
      console.log('ble off ha? ', bleStatus);
      if (locationStatus === false) {
        if (bleStatus) {
          setIssues(state => {
            return [
              ...state.filter(item => item !== 'Bluetooth is turned off'),
            ];
          });
        }
        console.log('chala location xxxx');
        setIssues(state => [...state, 'Location is turned off']);
      }
      if (bleStatus === false) {
        if (locationStatus) {
          console.log('chala bluetooth yyyyyy');
          setIssues(state => {
            return [...state.filter(item => item !== 'Location is turned off')];
          });
        }
        setIssues(state => [...state, 'Bluetooth is turned off']);
      }
    }
  };

  const handleSkip = () => {
    if (route.params?.from == 'Device') {
      return navigation.navigate('HomeBottomTab', { screen: 'Device' });
    }
    if (route.params?.from == 'SelectedDevice') {
      return navigation.goBack();
    } else {
      return navigation.navigate('HomeBottomTab', { screen: 'Home' });
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
          // <ScrollView
          //   nestedScrollEnabled
          //   contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}>
          <View>
            {step == 1 && <DLoader contentOpacity={props.contentOpacity} />}
            {step == 2 && (
              <DeviceSelectForm
                contentOpacity={props.contentOpacity}
                userInfo={
                  userStore.get().currentRegisterUser
                    ? userStore.get().currentRegisterUser?.userType.name
                    : userStore.get().userData?.userType.name
                }
                data={scannedDevices ?? []}
                setStep={(value: number) => setStep(value)}
                setDevMacId={(value?: string) =>
                  setDevInfo(state => ({ ...state, macId: value }))
                }
                selectedDeviceData={route?.params?.deviceData}
                autoSelect={route?.params?.from == 'SelectedDevice'}
              />
              // <View style={{ backgroundColor: 'pink', flex: 1 }} />
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
                setIssues={val =>
                  setIssues(state => {
                    return [...state, val];
                  })
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
                onSkip={handleSkip}
                btnText={
                  route.params?.from == 'Device' ? 'Done' : 'Search Masjid'
                }
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
                onSkip={handleSkip}
                isSuccess={false}
                btnText={toastContent.btnText ?? 'Try Again'}
                onPress={toastContent.onPress}
                title={toastContent.title ?? 'Device setup error'}
                message={toastContent.message ?? 'Please check'}
                points={
                  toastContent.points ?? [
                    'Device is powered on',
                    'Phone is within range of the device',
                    'Device Light is yellow',
                    'WiFi is working',
                  ]
                }
              />
            )}
          </View>
          // {/* </ScrollView> */}
        );
      }}
    </Wrapper>
  );
}
