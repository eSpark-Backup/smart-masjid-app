import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Theme,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImmutableObject, useHookstate } from '@hookstate/core';

import { PlusSvg } from '../../assets';
import { GapView, MyText, TextLabel, DeviceCard } from '../../components';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { DeviceSetting } from './Stacks';
import { userStore } from '../../store/UserStore';
import { deviceStore } from '../../store/DeviceStore';
import { Device as DeviceType } from '../../types/deviceControllerTypes';
import { GetUserDevices } from '../../api/deviceController';

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
      <Card height={161} width={172}>
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

export default function Device() {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('MyDevice');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>();
  const user = useHookstate(userStore?.userData)?.get();
  const devices: any = useHookstate(deviceStore?.devices)?.get();
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();
  const isFocused = useIsFocused();
  const theme: Theme = useTheme();
  const { colors } = theme;

  useEffect(() => {
    setStep(0);
    console.log('what is the user info', user?.userType?.name);
    console.log('what is the user info++++', devices);
    GetUserDevices(user?.id.toString() ?? '');
  }, [isFocused]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const realData = devices.filter((item: DeviceType) => {
    if (activeTab == 'MasjidDevice') {
      return item?.deviceType?.deviceCategory?.name === 'SMART_BUTTON';
    } else {
      return item?.deviceType?.deviceCategory?.name === 'SMART_SPEAKER';
    }
  });

  console.log('devices', realData);

  return (
    <Wrapper onBackPress={onBackPress} showFooter={false} bgImageSpacer={false}>
      {step == 0 && (
        <>
          <GapView length={30} />
          <TextLabel label="Devices" textStyle={{ alignSelf: 'center' }} />
          <GapView length={45} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: WINDOW_WIDTH - 80,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={user?.userType?.name === 'Customer' ? true : false}
              onPress={() => setActiveTab('MyDevice')}>
              <TextLabel
                label="My Devices"
                textStyle={{
                  color: activeTab == 'MyDevice' ? colors.primary : '#9E9F9F',
                }}
              />
              {activeTab == 'MyDevice' &&
                user?.userType?.name === 'Masjid Admin' && (
                  <View
                    style={{
                      height: 5,
                      width: 5,
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginTop: 5,
                    }}
                  />
                )}
            </TouchableOpacity>
            {user?.userType?.name === 'Masjid Admin' && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setActiveTab('MasjidDevice')}>
                <TextLabel
                  label="Masjid Devices"
                  textStyle={{
                    color:
                      activeTab == 'MasjidDevice' ? colors.primary : '#9E9F9F',
                  }}
                />
                {activeTab == 'MasjidDevice' && (
                  <View
                    style={{
                      height: 5,
                      width: 5,
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginTop: 5,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: realData?.length > 0 ? 'center' : 'flex-start',
            }}>
            <FlatList
              contentContainerStyle={{
                // backgroundColor: 'pink',
                // alignItems: 'center',
                // justifyContent: 'center',
                // paddingHorizontal: 10,
                // alignSelf: 'center',
                paddingVertical: 20,
                flexGrow: 1,
              }}
              numColumns={2}
              data={[...realData, 1]}
              renderItem={({
                item,
                index,
              }: {
                item: DeviceType;
                index: number;
              }) => {
                if (index != realData?.length) {
                  return (
                    <View style={{ marginHorizontal: 5 }}>
                      <DeviceCard
                        deviceData={item}
                        onPress={() => {
                          setStep(1);
                          setSelectedDevice(item);
                        }}
                        activeTab={activeTab}
                      />
                    </View>
                  );
                } else {
                  return (
                    <View
                      style={{
                        marginHorizontal: realData?.length < 1 ? 25 : 5,
                      }}>
                      <AddDevice />
                    </View>
                  );
                }
              }}
              ItemSeparatorComponent={GapView}
            />
          </View>
        </>
      )}
      {step == 1 && <DeviceSetting device={selectedDevice} />}
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
