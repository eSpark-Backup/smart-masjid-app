import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import {
  BatteryBar,
  DeviceObject,
  DeviceReset,
  DeviceSvg,
  Heart,
  Version,
  Wifi,
} from '../../../assets';
import {
  GapView,
  MyText,
  DeviceSettingSectionList,
  ErrorModal,
  DeviceStatus,
  DeviceErrorBox,
  OverlayLoader,
  LogoutModal,
  MyTitle,
  PossibleCauseErrorModal,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Device } from '../../../types/deviceControllerTypes';
import {
  _checkDeviceTelemetry,
  _resetDevice,
  _updateDevice,
  unSubscribeMasjid,
} from '../../../api/deviceController';
import {
  BottomNavigationParamList,
  DStatus,
  RootStackParamList,
} from '../../../types';

type DeviceNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

const DeviceSetting = ({
  device,
  contentOpacity = 0,
  goBack,
}: {
  device?: Device;
  contentOpacity: any;
  goBack?: () => void;
}) => {
  const theme: Theme = useTheme();
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();

  const [errorShow, setErrorShow] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isResetVisible, setIsResetVisible] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [offlineErrors, setOfflineErrors] = useState<boolean>(false);
  console.log('deive selectedx ??', device);

  const styles = useMemo(() => makeStyles(theme), []);

  const removeDevice = async () => {
    setLoader(true);
    try {
      const res = await _resetDevice(device?.id.toString()!);
      console.log('res', res);
      if (res) {
        setLoader(false);
        goBack?.();
      }
    } catch (error) {
      setLoader(false);
      crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  const updateDeviceName = async (text?: string, oldText?: string) => {
    console.log('text res', text, oldText);
    if (text !== oldText) {
      setLoader(true);
      try {
        const res = await _updateDevice({
          ...device!,
          name: text ?? device?.name!,
        });
        console.log('update res', res);
        if (res) {
          setLoader(false);
          goBack?.();
        }
      } catch (error) {
        crashlytics().recordError(error as Error);
        setLoader(false);
        console.error(error);
      }
    }
  };

  const cancelSubscription = async () => {
    try {
      if (device?.deviceTelemetry.status === 'Online') {
        setLoader(true);
        const res = await unSubscribeMasjid(
          device?.id?.toString()!,
          device?.masjid.id.toString()!,
        );
        console.log('res', res);
        if (res) {
          setLoader(false);
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

  return (
    <View>
      <OverlayLoader isShow={loader} />
      <ErrorModal
        visible={errorShow}
        message={
          'Looks like your device is offline, what would you like to do ?'
        }
        onClose={() => setErrorShow(false)}
        options={[
          {
            label: 'Update Password',
            onPress: async () => {
              console.log('error', device);
              setLoader(true);
              const isValid = await _checkDeviceTelemetry(
                device?.id.toString() as string,
                false,
              );
              if (isValid) {
                setErrorShow(false);
                setLoader(false);
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
                });
                setErrorShow(false);
                setLoader(false);
              }
            },
          },
          {
            label: 'Connect new Wi-Fi',
            onPress: async () => {
              setLoader(true);
              const isValid = await _checkDeviceTelemetry(
                device?.id.toString() as string,
                false,
              );
              if (isValid) {
                setErrorShow(false);
                setLoader(false);
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
                });
                setErrorShow(false);
                setLoader(false);
              }
            },
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
            show={Boolean(
              device?.deviceTelemetry?.status == 'Offline' ||
                device?.deviceTelemetry?.status == 'Low battery',
            )}
            onClose={() => console.log('on Close Box', device)}
            message={
              device?.deviceTelemetry?.status == 'Low battery'
                ? 'Device battery low. Please power on your device.'
                : 'Looks like your device is offline. Tap here to see causes.'
            }
            onIconPress={() => setOfflineErrors(true)}
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
                status={device?.deviceTelemetry?.status as DStatus}
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

                        if (text?.length! > 0 && pattern.test(text as string)) {
                          updateDeviceName(text, device?.name);
                          setIsEditable(false);
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
                    {
                      title: 'Battery',
                      subtitle: device?.deviceTelemetry?.batteryLife.toString()
                        ? device?.deviceTelemetry?.batteryLife.toString() + '%'
                        : 'NaN',
                      icon: <BatteryBar style={{ padding: 10, bottom: 2 }} />,
                      danger:
                        device?.deviceTelemetry?.batteryLife! <= 15
                          ? true
                          : false,
                    },
                    {
                      title:
                        device?.deviceType?.id == 1 ? 'Subscription' : 'Masjid',
                      subtitle: device?.masjid?.name
                        ? device?.masjid?.name
                        : device?.deviceType?.id == 1
                        ? 'No Subscription'
                        : 'No Masjid',
                      icon: <Heart style={{ padding: 10, bottom: 2 }} />,
                      isDelete: device?.masjid?.name ? true : false,
                      onDelete: () => setIsResetVisible(true),
                      onPress:
                        device?.deviceType.id == 1
                          ? () => {
                              if (!device?.masjid?.id.toString()) {
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
                      title: 'Wifi',
                      subtitle: device?.wifiSsid,
                      icon: <Wifi style={{ padding: 10, bottom: 2 }} />,
                      isEditable:
                        device?.deviceTelemetry?.status !== 'Offline'
                          ? true
                          : false,
                      danger:
                        device?.deviceTelemetry?.status !== 'Offline'
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
                      icon: <Version style={{ padding: 10, bottom: 2 }} />,
                    },
                    {
                      title: 'MAC Address',
                      subtitle: device?.macAddress,
                      icon: <DeviceObject style={{ padding: 10, bottom: 2 }} />,
                    },
                    {
                      title: 'Factory Reset',
                      subtitle: 'Reseting will erase all data',
                      // onPress: () => setIsVisible(true),
                      icon: <DeviceReset style={{ padding: 10, bottom: 2 }} />,
                      isReset: true,
                      onReset: () => setIsVisible(true),
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
        message="Are you sure you want to cancel subscription?"
        visible={isResetVisible}
        onAllowed={async () => {
          await cancelSubscription();
          setIsResetVisible(!isResetVisible);
          console.log('Logged Out');
        }}
        onClose={() => {
          setIsResetVisible(!isResetVisible);
          console.log('Cancelled');
        }}
      />
    </View>
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
