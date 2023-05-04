import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import {
  Attention,
  Battery,
  Clock,
  DeviceSvg,
  Heart,
  IP,
  WifiSvg,
} from '../../../assets';
import { GapView, MyText, TextLabel } from '../../../components';
import DeviceSettingSectionList from '../../../components/DeviceSettingSectionList';
import { WINDOW_WIDTH } from '../../../constants';
import { Device } from '../../../types/deviceControllerTypes';

const DeviceSetting = ({ device }: { device?: Device }) => {
  const theme: Theme = useTheme();
  console.log('deive selectedx ??', device);

  const styles = useMemo(() => makeStyles(theme), []);
  return (
    <>
      <GapView length={80} />
      <ScrollView>
        <View style={styles.deviceSettingContainer}>
          <TextLabel
            label="Device  Settings"
            textStyle={{ paddingVertical: 20 }}
          />
          <GapView length={20} />
          <View style={styles.subHeader}>
            <MyText text="Smart Speaker V1.0" textStyle={styles.deviceName} />
            <View style={styles.row}>
              <View style={styles.activeStatus} />
              <GapView mode="horizontal" length={5} />
              <MyText text="Online" />
            </View>
          </View>
          <GapView length={20} />
          <DeviceSettingSectionList
            data={[
              {
                title: 'General Settings',
                data: [
                  {
                    title: 'Nick Name',
                    subtitle: 'Home Device',
                    icon: <DeviceSvg />,
                    isEditable: true,
                  },
                  { title: 'Battery', subtitle: '20%', icon: <Battery /> },
                  {
                    title: 'Subscription',
                    subtitle: 'Masjid Al Noor',
                    icon: <Heart />,
                    isEditable: true,
                  },
                ],
              },
              {
                title: 'Advance Settings',
                data: [
                  {
                    title: 'Wifi',
                    subtitle: 'My_wifi_SSID',
                    icon: <WifiSvg />,
                    isEditable: true,
                  },
                  {
                    title: 'Firmware Version',
                    subtitle: 'Version 1.0',
                    icon: <Clock />,
                  },
                  {
                    title: 'MAC Address',
                    subtitle: 'aa:12:bc:dd:ee:87',
                    icon: <Heart />,
                  },
                  {
                    title: 'IP Address',
                    subtitle: '192.168.0.15',
                    icon: <IP />,
                  },
                  {
                    title: 'Factory Reset',
                    subtitle: 'Reseting will erase all data',
                    icon: <Attention height={24} width={24} />,
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
      color: colors.primary,
      fontSize: 16,
      fontWeight: '500',
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
