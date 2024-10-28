import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import {
  Theme,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import {
  DeviceObject,
  DeviceSvg,
  Heart,
  LAN,
  ResetDevice,
  Version,
  Wifi,
  WifiManage,
} from '../../../assets';
import {
  GapView,
  MyText,
  DeviceSettingSectionList,
  ErrorModal,
  DeviceStatus,
  DeviceErrorBox,
  LogoutModal,
  MyTitle,
  PossibleCauseErrorModal,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import {
  Device,
  DeviceFirmwareType,
  DeviceLogType,
} from '../../../types/deviceControllerTypes';
import {
  _checkDeviceTelemetry,
  _rebootDevice,
  _resetDevice,
  _updateDevice,
  getDeviceUpdateLogs,
  getFirmwareUpdates,
  unSubscribeMasjid,
  updateDeviceFirmware,
} from '../../../api/deviceController';
import {
  BottomNavigationParamList,
  DStatus,
  GlobalProps,
  RootStackParamList,
} from '../../../types';
import { State, useHookstate } from '@hookstate/core';
import { globalStore } from '../../../store/GlobalStates';

type DeviceNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

const DeviceSetting = ({
  device,
  contentOpacity = 0,
  goBack,
  isBtn,
  step,
  scrVisible,
}: {
  device?: Device;
  contentOpacity: any;
  goBack?: () => void;
  isBtn?: boolean;
  step: number;
  scrVisible: boolean;
}) => {
  const theme: Theme = useTheme();
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();

  const state: State<GlobalProps> = useHookstate(globalStore);
  const [errorShow, setErrorShow] = useState<boolean>(false);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isResetVisible, setIsResetVisible] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [offlineErrors, setOfflineErrors] = useState<boolean>(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const checkUpdateRef = useRef<any>(null);

  const styles = useMemo(() => makeStyles(theme), []);

  useEffect(() => {
    if (step == 0) {
      console.log('current 0', step);
      clearInterval(checkUpdateRef.current);
    } else {
      checkUpdateRef.current = setInterval(() => {
        getUpdateLogs();
      }, 30000);
    }
  }, [step]);

  useEffect(() => {
    getUpdateLogs();
  }, [device]);

  const removeDevice = async () => {
    state.globalLoading.set(true);
    try {
      const res = await _resetDevice(device?.id.toString()!);
      console.log('res', res);
      if (res) {
        state.globalLoading.set(false);
        goBack?.();
      } else {
        state.globalLoading.set(false);
      }
    } catch (error) {
      state.globalLoading.set(false);
      crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  const restartDevice = async () => {
    state.globalLoading.set(true);
    try {
      const res = await _rebootDevice(device?.id.toString()!);
      console.log('res', res);
      if (res) {
        state.globalLoading.set(false);
        goBack?.();
      } else {
        state.globalLoading.set(false);
      }
    } catch (error) {
      state.globalLoading.set(false);
      crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  const updateDeviceName = async (text?: string, oldText?: string) => {
    console.log('text res', text, oldText);
    if (text !== oldText) {
      state.globalLoading.set(true);
      try {
        const res = await _updateDevice({
          ...device!,
          name: text ?? device?.name!,
        });
        if (res == 200) {
          state.globalLoading.set(false);
          goBack?.();
          setIsEditable(false);
        }
      } catch (error) {
        crashlytics().recordError(error as Error);
        state.globalLoading.set(false);
        console.error(error);
      }
    }
  };

  const cancelSubscription = async () => {
    try {
      if (device?.deviceTelemetry.status === 'Online') {
        state.globalLoading.set(true);
        const res = await unSubscribeMasjid(
          device?.id?.toString()!,
          device?.masjid.id.toString()!,
        );
        console.log('unsub res', res);
        if (res) {
          state.globalLoading.set(false);
        }
      } else {
        Toast.show({
          text2: 'Device is Offline',
          type: 'error',
        });
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const getUpdateLogs = async () => {
    try {
      console.log('getUpdateLogs deviceId', device?.id);
      const logRes: DeviceLogType | null | false = await getDeviceUpdateLogs(
        device?.id!,
      );
      console.log('logRes', logRes);

      if (logRes) {
        if (logRes.status == 'I') {
          state.globalLoading.set(true);
          state.globalLoadingMsg.set(`Device update in progress...`);
        } else {
          state.globalLoading.set(false);
          state.globalLoadingMsg.set(``);
          clearInterval(checkUpdateRef.current);
          if (device?.deviceTelemetry.status == 'Online') {
            getFirmwareUpdate();
          }
        }
      } else if (logRes == null) {
        state.globalLoading.set(false);
        state.globalLoadingMsg.set(``);
        clearInterval(checkUpdateRef.current);
        if (device?.deviceTelemetry.status == 'Online') {
          getFirmwareUpdate();
        }
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
      clearInterval(checkUpdateRef.current);
    }
  };

  const getFirmwareUpdate = async () => {
    try {
      const updateRes: DeviceFirmwareType = await getFirmwareUpdates(
        device?.deviceType?.id.toString()!,
      );
      if (updateRes) {
        if (updateRes.version > device?.firmwareVersion!) {
          setUpdateAvailable(true);
        }
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const UpdateFirmware = async () => {
    console.log('UpdateFirmware', device?.id);
    try {
      const updateRes: DeviceFirmwareType = await updateDeviceFirmware(
        device?.id.toString()!,
      );
      console.log('UpdateFirmware Res', updateRes);
      if (updateRes) {
        setUpdateShow(false);
        checkUpdateRef.current = setInterval(() => {
          getUpdateLogs();
        }, 30000);
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  console.log('device?.', device?.deviceTelemetry.status);
  console.log(
    'device?.deviceTelemetry?.streamer',
    device?.deviceTelemetry?.streamer,
  );

  return (
    scrVisible && (
      <View>
        {/* <OverlayLoader isShow={loader} /> */}
        <ErrorModal
          visible={errorShow}
          title={'Wi-Fi Error'}
          message={
            'Looks like your device is offline, what would you like to do ?'
          }
          onClose={() => setErrorShow(false)}
          options={[
            {
              label: 'Update Password',
              onPress: async () => {
                console.log('error', device);
                state.globalLoading.set(true);
                const isValid = await _checkDeviceTelemetry(
                  device?.id.toString() as string,
                  false,
                );
                if (isValid) {
                  setErrorShow(false);
                  state.globalLoading.set(false);
                  goBack?.();
                  Toast.show({
                    text1: 'Success!',
                    text2: 'Your device is online',
                    type: 'success',
                  });
                } else {
                  navigation.navigate('DSetup', {
                    from: 'SelectedDevice',
                    deviceData: device,
                    onlyPassword: true,
                    isBtn: isBtn,
                  });
                  setErrorShow(false);
                  state.globalLoading.set(false);
                }
              },
            },
            {
              label: 'Connect new Wi-Fi',
              onPress: async () => {
                state.globalLoading.set(true);
                const isValid = await _checkDeviceTelemetry(
                  device?.id.toString() as string,
                  false,
                );
                if (isValid) {
                  setErrorShow(false);
                  state.globalLoading.set(false);
                  goBack?.();
                  Toast.show({
                    text1: 'Success!',
                    text2: 'Your device is online',
                    type: 'success',
                  });
                } else {
                  navigation.navigate('DSetup', {
                    from: 'SelectedDevice',
                    deviceData: device,
                    isBtn: isBtn,
                  });
                  setErrorShow(false);
                  state.globalLoading.set(false);
                }
              },
            },
          ]}
        />
        <ErrorModal
          visible={updateShow}
          title={'Firmaware Error'}
          message={
            'Please make sure your device is online before installing the latest firmware.'
          }
          message2={
            'It may take several minutes to update the device. Please do not close the app or turn off the device when update is in progress.'
          }
          onClose={() => setUpdateShow(false)}
          options={[
            {
              label: 'Update Firmware',
              onPress: UpdateFirmware,
            },
          ]}
        />
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            top:
              Platform.OS == 'ios'
                ? -WINDOW_WIDTH / 1.6 / 3
                : -WINDOW_WIDTH / 1.9 / 3,
          }}>
          <Animated.View style={[{ opacity: contentOpacity }]}>
            <MyTitle
              text="Devices"
              style={{
                // fontWeight: '400',
                fontFamily: 'Roboto-Regular',
              }}
            />
          </Animated.View>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsEditable(false)}>
          <View>
            <DeviceErrorBox
              show={
                device?.deviceType?.id == 3
                  ? !Boolean(
                      device?.deviceTelemetry?.streamer == null ||
                        device?.deviceTelemetry?.streamer == 'Running',
                    )
                  : updateAvailable
                  ? true
                  : Boolean(
                      device?.deviceTelemetry?.status == 'Offline' ||
                        device?.deviceTelemetry?.status == 'Low battery',
                    )
              }
              icon={device?.deviceType?.id == 3 ? false : true}
              onClose={() => console.log('on Close Box', device)}
              message={
                device?.deviceTelemetry?.status == 'Low battery'
                  ? 'Device battery low. Please power on your device.'
                  : device?.deviceType?.id == 3
                  ? 'Looks like the Masjid Streamer might be Offline. Contact support@smartmasjid.app for help.'
                  : updateAvailable
                  ? `There's a new firmware version for your device. Tap here to update.`
                  : 'Looks like your device is offline. Tap here to see causes.'
              }
              onIconPress={() =>
                updateAvailable ? setUpdateShow(true) : setOfflineErrors(true)
              }
            />
            <PossibleCauseErrorModal
              visible={offlineErrors}
              onClose={() => setOfflineErrors(false)}
            />
            <GapView />
            <View style={styles.deviceSettingContainer}>
              <View style={styles.subHeader}>
                <MyText
                  text={device?.deviceType?.name!}
                  textStyle={styles.deviceName}
                  size={20}
                  trademark
                />
                <DeviceStatus
                  status={
                    device?.deviceType?.id == 3
                      ? (device?.deviceTelemetry?.streamer as DStatus)
                      : (device?.deviceTelemetry?.status as DStatus)
                  }
                />
              </View>
              <GapView length={10} />
              <DeviceSettingSectionList
                data={[
                  {
                    title: 'General',
                    data: [
                      {
                        title: 'Name',
                        subtitle: device?.name,
                        icon: <DeviceSvg style={{ padding: 10, bottom: 2 }} />,
                        isEditable: true,
                        isEdit: isEditable,
                        onEditPress: () => setIsEditable(true),
                        charLength: 25,
                        onDoneEdit: text => {
                          console.log('avla', text);
                          const pattern = /^[a-zA-Z0-9 ]*$/;
                          if (
                            text?.length! > 0 &&
                            pattern.test(text as string)
                          ) {
                            updateDeviceName(text, device?.name);
                          } else if (
                            text?.length! > 0 &&
                            !pattern.test(text as string)
                          ) {
                            Toast.show({
                              text1: 'Error!',
                              text2:
                                'Device name cannot contain special characters',
                              type: 'error',
                            });
                          } else {
                            setIsEditable(false);
                          }
                        },
                      },
                      // {
                      //   title: device?.deviceType?.id == 3 ? '' : 'Battery',
                      //   subtitle:
                      //     device?.deviceType?.id == 3
                      //       ? device?.deviceTelemetry?.streamer ?? 'null'
                      //       : device?.deviceTelemetry?.batteryLife.toString()
                      //       ? device?.deviceTelemetry?.batteryLife.toString() +
                      //         '%'
                      //       : 'NaN',
                      //   icon:
                      //     device?.deviceType?.id == 3 ? (
                      //       <Streamer style={{ padding: 10, bottom: 2 }} />
                      //     ) : (
                      //       <BatteryBar style={{ padding: 10, bottom: 2 }} />
                      //     ),
                      //   danger:
                      //     device?.deviceType?.id == 3
                      //       ? false
                      //       : device?.deviceTelemetry?.batteryLife! <= 15
                      //       ? true
                      //       : false,
                      // },
                      {
                        title:
                          device?.deviceType?.id == 1
                            ? 'Subscription'
                            : 'Masjid',
                        subtitle: device?.masjid?.name
                          ? device?.masjid?.name
                          : device?.deviceType?.id == 1
                          ? 'No Subscription'
                          : 'No Masjid',
                        icon: <Heart style={{ padding: 10, bottom: 2 }} />,
                        isDelete:
                          device?.masjid?.name && device?.deviceType?.id == 1
                            ? true
                            : false,
                        onDelete: () => setIsResetVisible(true),
                        onPress:
                          device?.deviceType.id == 1
                            ? () => {
                                if (!device?.masjid?.id.toString()) {
                                  goBack?.();
                                  navigation.navigate('Search');
                                  return;
                                }
                                goBack?.();
                                navigation.navigate('Home', {
                                  masjidId: device?.masjid?.id.toString(),
                                });
                              }
                            : undefined,
                      },
                    ],
                  },
                  {
                    title: 'Advanced',
                    data: [
                      {
                        title:
                          device?.deviceType?.id == 3 ? 'IP Address' : 'Wi-Fi',
                        subtitle:
                          device?.deviceType?.id == 3
                            ? device?.ipAddress
                            : device?.wifiSsid,
                        icon:
                          device?.deviceType?.id == 3 ? (
                            <LAN />
                          ) : (
                            <Wifi style={{ padding: 10, bottom: 2 }} />
                          ),
                        editIcon: <WifiManage width={24} height={24} />,
                        isEditable:
                          device?.deviceType?.id == 3
                            ? false
                            : device?.deviceTelemetry?.status !== 'Offline'
                            ? true
                            : false,
                        danger:
                          device?.deviceType?.id == 3
                            ? false
                            : device?.deviceTelemetry?.status !== 'Offline'
                            ? false
                            : true,
                        onEditPress: () =>
                          navigation.navigate('DSetup', {
                            from: 'SelectedDevice',
                            deviceData: device,
                          }),
                        onDangerPress: () => setErrorShow(true),
                      },
                      {
                        title: 'Firmware Version',
                        subtitle: 'Version ' + device?.firmwareVersion,
                        danger: updateAvailable,
                        onDangerPress: () => setUpdateShow(true),
                        icon: <Version style={{ padding: 10, bottom: 2 }} />,
                      },
                      {
                        title: 'MAC Address',
                        subtitle: device?.macAddress,
                        icon: (
                          <DeviceObject style={{ padding: 10, bottom: 2 }} />
                        ),
                      },
                      {
                        title:
                          device?.deviceType?.id == 3
                            ? 'Reboot'
                            : 'Factory Reset',
                        subtitle:
                          device?.deviceType?.id == 3
                            ? 'Rebooting will restart the device'
                            : 'Reseting will erase all data',
                        // onPress: () => setIsVisible(true),
                        icon: (
                          <ResetDevice style={{ padding: 10, bottom: 2 }} />
                        ),
                        isReset: device?.deviceType?.id == 3 ? false : true,
                        isReboot: device?.deviceType?.id == 3 ? true : false,
                        onReset: () =>
                          device?.deviceType?.id == 3
                            ? setVisible(true)
                            : setIsVisible(true),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <LogoutModal
          message="The device will be removed permanently. Do you still want to reset?"
          visible={isVisible}
          onAllowed={async () => {
            await removeDevice();
            setIsVisible(!isVisible);
            console.log('Logged Out');
          }}
          onClose={() => {
            setIsVisible(!isVisible);
            console.log('Cancelled');
          }}
        />
        <LogoutModal
          message="Are you sure you want to restart the device?"
          visible={visible}
          onAllowed={async () => {
            await restartDevice();
            setVisible(!visible);
          }}
          onClose={() => {
            setVisible(!visible);
            console.log('Cancelled');
          }}
        />
        <LogoutModal
          message="Are you sure you want to cancel subscription?"
          visible={isResetVisible}
          onAllowed={async () => {
            setIsResetVisible(!isResetVisible);
            await cancelSubscription();
            goBack?.();
            console.log('Logged Out');
          }}
          onClose={() => {
            setIsResetVisible(!isResetVisible);
            console.log('Cancelled');
          }}
        />
      </View>
    )
  );
};

const makeStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    AddDeviceContainer: {
      padding: 15,
      justifyContent: 'center',
      height: 161,
    },
    deviceSettingContainer: { flex: 1, alignItems: 'center' },
    subHeader: {
      flexDirection: 'row',
      width: WINDOW_WIDTH - 28,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deviceName: {
      fontSize: 20,
      // fontWeight: '700',
      fontFamily: 'Roboto-Bold',
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    activeStatus: {
      height: 8,
      width: 8,
      borderWidth: 0.7,
      borderRadius: 10,
      backgroundColor: '#1DF126',
    },
  });
};

export default DeviceSetting;
