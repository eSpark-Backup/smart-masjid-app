import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import {
  Attention,
  Battery,
  BatteryBar,
  Clock,
  DeviceObject,
  DeviceReset,
  DeviceSvg,
  Heart,
  IP,
  Version,
  Wifi,
  WifiSvg,
} from '../../../assets';
import {
  GapView,
  MyText,
  TextLabel,
  DeviceSettingSectionList,
  ErrorModal,
  DeviceStatus,
  DeviceErrorBox,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Device } from '../../../types/deviceControllerTypes';

const DeviceSetting = ({ device }: { device?: Device }) => {
  const theme: Theme = useTheme();
  const [errorShow, setErrorShow] = useState<boolean>(false);
  console.log('deive selectedx ??', device);

  const styles = useMemo(() => makeStyles(theme), []);
  return (
    <>
      <ErrorModal
        visible={errorShow}
        message="Looks like your device is offline, what would you like to do ?"
        onClose={() => console.log('pressed cancel')}
        options={[
          { label: 'Update Password', onPress: () => console.log('option 1') },
          {
            label: 'Connect new Wi-Fi',
            onPress: () => console.log('option 2'),
          },
        ]}
      />
      <GapView length={20} />
      <TextLabel label="Device Settings" textStyle={{ alignSelf: 'center' }} />
      <GapView length={45} />
      <ScrollView>
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
            <DeviceStatus online />
          </View>
          <GapView length={20} />
          <DeviceErrorBox
            show={true}
            onClose={() => console.log('on Close Box', device)}
            message="Looks like your device se.Cupidatat sint sint elit nostrud mollit ad sunt cupidatat ex duis est."
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
                  },
                  {
                    title: 'Battery',
                    subtitle:
                      device?.deviceTelemetry?.batteryLife.toString() ??
                      '??' + ' %',
                    icon: <BatteryBar style={{ padding: 10, bottom: 2 }} />,
                    danger: true,
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
                    isEditable: true,
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
                    onPress: () => {
                      console.log('Reset Device?');
                    },
                    icon: <DeviceReset style={{ padding: 10, bottom: 2 }} />,
                  },
                ],
              },
            ]}
          />
        </View>
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
