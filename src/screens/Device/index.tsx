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

export default function Device() {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('MyDevice');
  const user = useHookstate(userStore?.userData)?.get();
  const devices: any = useHookstate(deviceStore?.devices)?.get();
  const navigation = useNavigation<DeviceNavigationProps['navigation']>();
  const isFocused = useIsFocused();
  const theme: Theme = useTheme();
  const { colors } = theme;
  useEffect(() => {
    setStep(0);
    console.log('what is the user info', user?.userType?.name);
    console.log('what is the user info', devices);
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
  return (
    <Wrapper
      onBackPress={onBackPress}
      showFooter={false}
      bgImageSpacer={step == 1 ? false : true}>
      {step == 0 && (
        <>
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
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 20,
            }}
            numColumns={2}
            data={realData}
            renderItem={({
              item,
              index,
            }: {
              item: DeviceType;
              index: number;
            }) => {
              return (
                <>
                  <DeviceCard
                    deviceData={item}
                    onPress={() => setStep(1)}
                    activeTab={activeTab}
                  />
                  <AddDevice />
                </>
              );
            }}
            ItemSeparatorComponent={GapView}
          />
        </>
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
