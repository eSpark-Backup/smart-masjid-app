import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Text,
  Platform,
} from 'react-native';
import {
  Theme,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import {
  BatteryBar,
  DeviceObject,
  DeviceReset,
  DeviceSvg,
  Heart,
  InfoRed,
  Version,
  Wifi,
} from '../../../assets';
import {
  GapView,
  MyText,
  TextLabel,
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
import { _resetDevice, _updateDevice } from '../../../api/deviceController';
import { BottomNavigationParamList, RootStackParamList } from '../../../types';

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

  return (
    <View>
      <OverlayLoader isShow={loader} />
      <ErrorModal
        visible={errorShow}
        message={
          device?.deviceTelemetry?.status == 'Online'
            ? 'What would you like to do ?'
            : 'Looks like your device is offline, what would you like to do ?'
        }
        onClose={() => setErrorShow(false)}
        options={[
          {
            label: 'Update Password',
            onPress: () => {
              // goBack?.();
              console.log('error', device);
              navigation.navigate('DSetup', {
                from: 'SelectedDevice',
                deviceData: device,
                onlyPassword: true,
              });
              setErrorShow(false);
            },
          },
          {
            label: 'Connect new Wi-Fi',
            onPress: () => {
              // goBack?.();
              navigation.navigate('DSetup', {
                from: 'SelectedDevice',
                deviceData: device,
              });
              setErrorShow(false);
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
          <MyTitle text="Devices" style={{ fontWeight: '400' }} />
        </Animated.View>
      </View>
      <ScrollView>
        <DeviceErrorBox
          show={device?.deviceTelemetry?.status == 'Online' ? false : true}
          onClose={() => console.log('on Close Box', device)}
          message="Looks like your device is offline. Tap here to see causes."
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
              text={`Masjid Adhan ${
                device?.deviceType?.modelNumber?.includes('SBB')
                  ? 'Button'
                  : 'Speaker'
              }`}
              textStyle={styles.deviceName}
            />
            <DeviceStatus
              online={
                device?.deviceTelemetry?.status == 'Online' ? true : false
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
                    charLength: 25,
                    onPress: () => setIsEditable(true),
                    onDoneEdit: text => {
                      console.log('avla', text);
                      if (text?.length! < 0) {
                        updateDeviceName(text, device?.name);
                      }
                      setIsEditable(false);
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
                    title: 'Subscription',
                    subtitle: device?.masjid?.name ?? 'No Subscription',
                    icon: <Heart style={{ padding: 10, bottom: 2 }} />,
                    rightArrow: device?.deviceType.id == 1 ? true : false,
                    onPress:
                      device?.deviceType.id == 1
                        ? () => {
                            if (!device?.masjid?.id.toString()) {
                              Toast.show({
                                text1: 'Warning!',
                                text2: 'Subscribe to a Masjid First',
                                type: 'warning',
                              });
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
                      device?.deviceTelemetry?.status === 'Online'
                        ? true
                        : false,
                    danger:
                      device?.deviceTelemetry?.status === 'Online'
                        ? false
                        : true,
                    onPress: () => setErrorShow(true),
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
                    onPress: () => setIsVisible(true),
                    icon: <DeviceReset style={{ padding: 10, bottom: 2 }} />,
                  },
                ],
              },
            ]}
          />
        </View>
      </ScrollView>
      <LogoutModal
        message="The device will remove permanently. Do you still want to reset?"
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
      width: '100%',
      paddingHorizontal: 14,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deviceName: {
      fontSize: 20,
      fontWeight: '700',
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
