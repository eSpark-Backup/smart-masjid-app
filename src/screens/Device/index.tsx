import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  BackHandler,
} from 'react-native';
import {
  Theme,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHookstate } from '@hookstate/core';
import jwtDecode from 'jwt-decode';
import crashlytics from '@react-native-firebase/crashlytics';

import { PlusSvg } from '../../assets';
import {
  GapView,
  TextLabel,
  DeviceCard,
  TabView,
  MyTitle,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { DeviceSetting } from './Stacks';
import { userStore } from '../../store/UserStore';
import { deviceStore } from '../../store/DeviceStore';
import { Device as DeviceType } from '../../types/deviceControllerTypes';
import { GetMasjidDevices, GetUserDevices } from '../../api/deviceController';
import { UserToken } from '../../types/userControllerApiResponse';

type DeviceNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

const AddDevice = () => {
  const theme: Theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();

  return (
    <View>
      <Card height={161} width={172} backgroundColor="#ffffff">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('DSetup', { from: 'Device' })}
          style={styles.AddDeviceContainer}>
          <View style={{ alignItems: 'center' }}>
            <PlusSvg style={{ color: theme.colors.primary }} />
            <GapView length={10} />
            <TextLabel
              label="Add Device"
              textStyle={{
                color: theme.colors.primary,
                fontSize: 16,
                fontWeight: '500',
              }}
            />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default function Device({ contentOpacity = 0 }: any) {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>();
  const user = useHookstate(userStore?.userData)?.get();
  const USER_TOKEN: any = useHookstate(userStore?.token)?.get();
  const devices: any = useHookstate(deviceStore?.devices)?.get();
  const masjidDevices: any = useHookstate(deviceStore?.masjidDevices)?.get();
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();
  const isFocused = useIsFocused();
  const theme: Theme = useTheme();
  const { colors } = theme;

  useEffect(() => {
    if (step == 0) {
      handleGetDevices();
    }
  }, [isFocused, step]);

  const handleGetDevices = async () => {
    try {
      const jwtDecodedObj: UserToken = jwtDecode(USER_TOKEN);
      console.log('what is the user info', user?.userType?.name);
      console.log('what is the user info++++', JSON.stringify(jwtDecodedObj));
      await GetUserDevices(user?.id.toString() ?? '');
      await GetMasjidDevices(jwtDecodedObj?.masjidId.toString() ?? '');
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => backHandler.remove();
  }, [step]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
    return true;
  };

  const finalData = activeTab == '1' ? devices : masjidDevices;

  console.log('devices', activeTab == '1' ? devices : masjidDevices);

  return (
    <Wrapper
      onBackPress={onBackPress}
      showFooter={false}
      bgImageSpacer={false}
      title="Devices">
      {({ props }) => {
        return (
          <>
            {step == 0 && (
              <View>
                <View
                  style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    top:
                      Platform.OS == 'ios'
                        ? -WINDOW_WIDTH / 1.6 / 3
                        : -WINDOW_WIDTH / 1.9 / 3,
                  }}>
                  <Animated.View style={[{ opacity: props?.contentOpacity }]}>
                    <MyTitle text="Devices" />
                  </Animated.View>
                </View>
                <GapView />
                <View>
                  {user?.userType?.permissions.some(
                    val => val.name === 'MANAGE_MASJID_DEVICES',
                  ) ? (
                    <TabView
                      tab1Title="My Devices"
                      onChange={setActiveTab}
                      tab2Title="Masjid Devices"
                      currTab={activeTab}
                    />
                  ) : (
                    <MyTitle
                      text="My Devices"
                      style={{
                        color: colors.primary,
                        alignSelf: 'center',
                      }}
                    />
                  )}
                  <View
                    style={{
                      flex: 1,
                      alignItems:
                        finalData?.length > 0 ? 'center' : 'flex-start',
                    }}>
                    <FlatList
                      contentContainerStyle={{
                        paddingVertical: 20,
                        flexGrow: 1,
                      }}
                      numColumns={2}
                      data={[...finalData, 1]}
                      renderItem={({
                        item,
                        index,
                      }: {
                        item: DeviceType;
                        index: number;
                      }) => {
                        if (index != finalData?.length) {
                          return (
                            <View style={{ marginHorizontal: 5 }}>
                              <DeviceCard
                                deviceData={item}
                                onPress={() => {
                                  setStep(1);
                                  setSelectedDevice(item);
                                  console.log('what', item);
                                }}
                                activeTab={activeTab}
                              />
                            </View>
                          );
                        } else {
                          return (
                            <View
                              style={{
                                marginHorizontal:
                                  finalData?.length < 1 ? 25 : 5,
                              }}>
                              <AddDevice />
                            </View>
                          );
                        }
                      }}
                      ItemSeparatorComponent={GapView}
                    />
                  </View>
                </View>
              </View>
            )}
            {step == 1 && (
              <DeviceSetting
                contentOpacity={props.contentOpacity}
                device={selectedDevice}
                goBack={() => setStep(0)}
              />
            )}
          </>
        );
      }}
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
