import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import { Theme, useIsFocused, useTheme } from '@react-navigation/native';
import { useHookstate } from '@hookstate/core';
import Toast from 'react-native-toast-message';

import {
  GapView,
  JumuahTable,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  OutlineDeviceContainer,
  OverlayLoader,
  SwipeableTimeTable,
  TextLabel,
  Tooltip,
} from '../../../components';

import { WINDOW_WIDTH } from '../../../constants';
import { userStore } from '../../../store/UserStore';
import {
  JummahTime,
  Masjid,
  SalahTimings,
  SubscriptionList,
} from '../../../types/masjidControllerTypes';
import {
  getDeviceSubscriptions,
  GetMasjidDevicesForUser,
  unSubscribeMasjid,
} from '../../../api/deviceController';
import { masjidStore } from '../../../store/MasjidStore';
import { Device } from '../../../types/deviceControllerTypes';
import { useMasjid } from '../../../utils/hooks';
import {
  GetMasjidJummahTiming,
  getSalahTimingsOfMasjid,
} from '../../../api/masjidController';

export default function MasjidDetails({
  setStep,
  contentOpacity,
  selectedMasjid,
  isSingle,
}: {
  selectedMasjid?: Masjid | null;
  setStep: (value: any) => void;
  contentOpacity: any;
  isSingle?: boolean;
}) {
  const { colors }: Theme = useTheme();
  const userData = useHookstate(userStore.userData).get();
  const devices = useHookstate(masjidStore.connectedDevices).get();
  const [loading, setLoading] = useState<boolean>(false);
  const [subs, setSubs] = useState<SubscriptionList[]>([]);
  const connectedDevices = useMemo(() => devices, [devices]);
  const [salahTime, setSalahTime] = useState<SalahTimings[]>([]);
  const [currentDevice, setCurrentDevice] = useState<Device>();
  const isFocused = useIsFocused();

  const {
    getMasjidListSubscribedByUser,
    store: { salahTimings, JummahTime },
  } = useMasjid();

  useEffect(() => {
    setCurrentDevice(connectedDevices[0] as Device);
  }, []);

  useEffect(() => {
    if (isFocused) {
      getSalahTimes();
    }
  }, [isFocused]);

  useEffect(() => {
    if (currentDevice) {
      getSubscriptions(currentDevice?.id.toString()!);
    }
  }, [currentDevice]);

  const getSalahTimes = async () => {
    setLoading(true);
    await GetMasjidDevicesForUser(
      userData?.id?.toString() ?? '',
      selectedMasjid?.id.toString(),
    ).then(res => {
      setCurrentDevice(connectedDevices[0] as Device);
    });
    getSalahTimingsOfMasjid(selectedMasjid?.id.toString() ?? '').then(data => {
      setSalahTime(data as SalahTimings[]);
      setLoading(false);
    });
    await GetMasjidJummahTiming(selectedMasjid?.id.toString() ?? '');
  };

  const getSubscriptions = (id: string) => {
    getDeviceSubscriptions(id).then(data => {
      setSubs(data);
      setTimeout(() => {
        if (loading) {
          setLoading(false);
        }
      }, 2000);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <OverlayLoader isShow={loading} noBg={false} />
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
          <MyTitle text="Masjid Subscriptions" />
        </Animated.View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}>
        <MyTextHeader text={selectedMasjid?.name ?? ''} />
        <GapView length={15} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MyTextSubHeader
            text="Connected Devices"
            style={{ color: '#3E3E3E' }}
          />
          <GapView length={5} mode="horizontal" />
          <Tooltip content="These are your devices connected to this masjid. Click on each device to manage the subscriptions." />
        </View>
        <GapView length={15} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={connectedDevices! as Device[]}
          renderItem={({ item, index }: { item: Device; index: number }) => (
            <OutlineDeviceContainer
              onPress={() => {
                setCurrentDevice(item);
              }}
              name={item.name}
              isActive={item.id == currentDevice?.id}
              isOnline={
                item?.deviceTelemetry?.status == 'Online' ? true : false
              }
            />
          )}
          keyExtractor={item => item.id + (Math.random() * 999).toString()}
          ItemSeparatorComponent={() => <GapView mode="horizontal" />}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Salah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <SwipeableTimeTable
          isMute
          isInfo
          deviceInfo={currentDevice!}
          masjidSubscriptions={
            selectedMasjid?.subscriptionList as SubscriptionList[]
          }
          data={(salahTime as SalahTimings[]) ?? []}
          subscriptions={subs}
          setSubscriptions={setSubs}
          setLoading={val => setLoading(val)}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Jumuah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <JumuahTable
          headings={['Salah', 'Khutba']}
          masjidSubscriptions={
            selectedMasjid?.subscriptionList as SubscriptionList[]
          }
          subscriptions={subs}
          setSubscriptions={setSubs}
          deviceInfo={currentDevice!}
          isMute={true}
          data={JummahTime as JummahTime}
          setLoading={val => setLoading(val)}
        />
        <GapView length={15} />
        <View style={{ width: '100%', alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: 41,
              width: '85%',
              backgroundColor: '#FF6464',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            onPress={async () => {
              if (currentDevice?.deviceTelemetry.status === 'Online') {
                setLoading(true);
                const res = await unSubscribeMasjid(
                  currentDevice?.id?.toString()!,
                  selectedMasjid?.id?.toString()!,
                );
                console.log('res', res);
                if (res) {
                  // await getMasjidListSubscribedByUser(
                  //   userData?.id?.toString() ?? '',
                  // );
                  setStep(0);
                  setLoading(false);
                }
              } else {
                Toast.show({
                  text2: 'Selected Device is Offline',
                  type: 'error',
                });
              }
            }}>
            <TextLabel
              label="Unsubscribe"
              textStyle={{ color: '#ffffff', fontWeight: '400' }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
