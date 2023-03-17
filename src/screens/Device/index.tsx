import {
  Theme,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Attention,
  Battery,
  Clock,
  DeviceSvg,
  Heart,
  IP,
  PlusSvg,
  SettingGreen,
  WifiSvg,
} from '../../assets';
import { GapView, MyText, TextLabel } from '../../components';
import DeviceCard from '../../components/DeviceCard';
import DeviceSettingSectionList from '../../components/DeviceSettingSectionList';
import { WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';
import { BottomNavigationParamList, RootStackParamList } from '../../types';

type DeviceNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

const AddDevice = () => {
  const theme: Theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();

  return (
    <View style={{ marginHorizontal: 10 }}>
      <Card height={161} width={165}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('DSetup', { from: 'Device' })}
          style={styles.AddDeviceContainer}>
          <View style={{ alignItems: 'center' }}>
            <PlusSvg style={{ color: '#6E6E6E' }} />
            <GapView length={10} />
            <TextLabel label="Add Device" textStyle={{ color: '#6E6E6E' }} />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const DeviceSetting = () => {
  const theme: Theme = useTheme();
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

export default function Device() {
  const [step, setStep] = useState(0);
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();
  const isFocused = useIsFocused();

  useEffect(() => {
    setStep(0);
  }, [isFocused]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };
  const data = Array(4).fill(10);
  return (
    <Wrapper
      onBackPress={onBackPress}
      showFooter={false}
      bgImageSpacer={step == 1 ? false : true}>
      {step == 0 && (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 20,
          }}
          numColumns={2}
          data={data}
          renderItem={({ index }) => {
            if (index != (data?.length - 1)) {
              return <DeviceCard onPress={() => setStep(1)} />;
            } else {
              return <AddDevice />;
            }
          }}
          ItemSeparatorComponent={GapView}
        />
      )}
      {step == 1 && <DeviceSetting />}
    </Wrapper>
  );
}

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
