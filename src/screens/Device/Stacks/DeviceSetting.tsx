import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
  TextLabel,
  DeviceSettingSectionList,
  ErrorModal,
  DeviceStatus,
  DeviceErrorBox,
  OverlayLoader,
  LogoutModal,
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
      console.error(error);
    }
  };

  const updateDeviceName = async (text?: string) => {
    setLoader(true);
    console.log('text res', text);
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
      setLoader(false);
      console.error(error);
    }
  };

  return (
    <>
      <OverlayLoader isShow={loader} />
      <ErrorModal
        visible={errorShow}
        message="Looks like your device is offline, what would you like to do ?"
        onClose={() => setErrorShow(false)}
        options={[
          {
            label: 'Update Password',
            onPress: () => {
              goBack?.();
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
              goBack?.();
              navigation.navigate('DSetup', {
                from: 'SelectedDevice',
                deviceData: device,
              });
              setErrorShow(false);
            },
          },
        ]}
      />
      <View style={{ alignSelf: 'center', top: 100 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel label="Devices" textStyle={{ alignSelf: 'center' }} />
        </Animated.View>
        <GapView length={50} />
      </View>

      <ScrollView style={{ top: 100 }}>
        <View style={styles.deviceSettingContainer}>
          <GapView length={20} />
          <View style={styles.subHeader}>
            <MyText
              text={`Smart Adhan ${
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
          <GapView length={20} />
          <DeviceErrorBox
            show={device?.deviceTelemetry?.status == 'Online' ? false : true}
            onClose={() => console.log('on Close Box', device)}
            message="Looks like your device is offline. If you believe your WiFi is working, please power off and power on the device."
          />
          <DeviceSettingSectionList
            data={[
              {
                title: 'General Settings',
                data: [
                  {
                    title: 'Nick Name',
                    subtitle: device?.name,
                    icon: <DeviceSvg style={{ padding: 10, bottom: 2 }} />,
                    isEditable: true,
                    isEdit: isEditable,
                    onPress: () => setIsEditable(true),
                    onDoneEdit: text => {
                      updateDeviceName(text);
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
                    rightArrow: true,
                    onPress: () => console.log('Edit Subscription'),
                  },
                ],
              },
              {
                title: 'Advance Settings',
                data: [
                  {
                    title: 'Wifi',
                    subtitle: device?.wifiSsid,
                    icon: <Wifi style={{ padding: 10, bottom: 2 }} />,
                    danger:
                      device?.deviceTelemetry?.status == 'Online'
                        ? false
                        : true,
                    onPress: () => setErrorShow(true),
                  },
                  {
                    title: 'Firmware Version',
                    subtitle: device?.firmwareVersion,
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
      </ScrollView>
    </>
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
      width: WINDOW_WIDTH / 1.2,
      justifyContent: 'space-between',
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '600',
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
