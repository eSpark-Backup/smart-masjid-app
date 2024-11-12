import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import {
  Theme,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { State, useHookstate } from '@hookstate/core';
import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  GapView,
  JumuahTable,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  OutlineDeviceContainer,
  SwipeableTimeTable,
  Tooltip,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { userStore } from '../../../store/UserStore';
import {
  AdhanLog,
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
  GetAdhanLog,
  GetMasjidCurrentJummahTiming,
  getSalahTimingsOfMasjid,
} from '../../../api/masjidController';
import moment from 'moment';
import { globalStore } from '../../../store/GlobalStates';
import { BottomNavigationParamList, GlobalProps } from '../../../types';
import { Calendar } from '../../../assets';

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

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
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  const userData = useHookstate(userStore.userData).get();
  const monthlyScheduleData = useHookstate(userStore.monthlySchedule).get();
  const state: State<GlobalProps> = useHookstate(globalStore);
  const devices = useHookstate(masjidStore.connectedDevices).get();
  const [loading, setLoading] = useState<boolean>(false);
  const [subs, setSubs] = useState<SubscriptionList[]>([]);
  const [logs, setLogs] = useState<AdhanLog | null>(null);
  const connectedDevices = useMemo(() => devices, [devices]);
  const [salahTime, setSalahTime] = useState<SalahTimings[]>([]);
  const [currentDevice, setCurrentDevice] = useState<Device>();
  const isFocused = useIsFocused();

  const {
    store: { JummahTime },
  } = useMasjid();

  useEffect(() => {
    setCurrentDevice(connectedDevices[0] as Device);
  }, []);

  useEffect(() => {
    if (isFocused) {
      getAdhanLogs();
      getSalahTimes();
    }
  }, [isFocused]);

  const getSalahTimes = async () => {
    try {
      state.globalLoading.set(true);

      setLoading(true);

      await GetMasjidDevicesForUser(
        userData?.id?.toString() ?? '',
        selectedMasjid?.id.toString(),
      ).then(() => {
        setCurrentDevice(connectedDevices[0] as Device);
        if (connectedDevices[0]) {
          getSubscriptions(connectedDevices[0]?.id.toString()!);
        }
      });
      await GetMasjidCurrentJummahTiming(selectedMasjid?.id.toString() ?? '');
      await getSalahTimingsOfMasjid(
        selectedMasjid?.id.toString() ?? '',
        moment().format('YYYY-MM-DD').toString(),
        'WEEK',
      ).then(data => {
        setSalahTime(data as SalahTimings[]);
        setLoading(false);
        setTimeout(() => {
          state.globalLoading.set(false);
        }, 100);
      });
    } catch (e) {
      crashlytics().recordError(e as Error);
      state.globalLoading.set(false);
      setLoading(false);
    }
  };

  const getSubscriptions = async (id: string) => {
    try {
      await getDeviceSubscriptions(id).then(data => {
        setSubs(data);
      });
    } catch (e) {
      crashlytics().recordError(e as Error);
      state.globalLoading.set(false);
    }
  };

  const getAdhanLogs = async () => {
    try {
      await GetAdhanLog(
        selectedMasjid?.id.toString() ?? '',
        moment().format('YYYY-MM-DD').toString(),
      ).then(data => {
        setLogs(data);
      });
    } catch (e) {
      crashlytics().recordError(e as Error);
      state.globalLoading.set(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
              onPress={async () => {
                state.globalLoading.set(true);
                setCurrentDevice(item);
                await getSubscriptions(item.id.toString());
                state.globalLoading.set(false);
              }}
              name={item.name}
              isActive={item.id == currentDevice?.id}
              isOnline={
                item?.deviceTelemetry?.status == 'Online' ? true : false
              }
            />
          )}
          // keyExtractor={item => item.id + (Math.random() * 999).toString()}
          ItemSeparatorComponent={() => <GapView mode="horizontal" />}
        />
        <GapView length={15} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <MyTextSubHeader text="Salah Timings" style={{ color: '#3E3E3E' }} />
          {monthlyScheduleData && (
            <TouchableOpacity activeOpacity={0.5} onPress={() => setStep(2)}>
              <Calendar style={{ color: '#006870', right: 15 }} />
            </TouchableOpacity>
          )}
        </View>
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
          setLoading={val => {
            state.globalLoading.set(val);
            setLoading(val);
          }}
          deviceGetsOnline={getSalahTimes}
          loading={loading}
          adhanLog={logs}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Jumuah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <JumuahTable
          headings={['Salah', 'Khutbah']}
          masjidSubscriptions={
            selectedMasjid?.subscriptionList as SubscriptionList[]
          }
          subscriptions={subs}
          setSubscriptions={setSubs}
          deviceInfo={currentDevice!}
          isMute={true}
          data={JummahTime as JummahTime}
          setLoading={val => {
            state.globalLoading.set(val);
            setLoading(val);
          }}
        />
        <GapView length={15} />
        {/* <View style={{ width: '100%', alignItems: 'center' }}>
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
              try {
                if (currentDevice?.deviceTelemetry.status === 'Online') {
                  setLoading(true);
                  const res = await unSubscribeMasjid(
                    currentDevice?.id?.toString()!,
                    selectedMasjid?.id?.toString()!,
                  );
                  console.log('res', res);
                  if (res) {
                    setStep(0);
                    setLoading(false);
                  }
                } else {
                  Toast.show({
                    text2: 'Selected Device is Offline',
                    type: 'error',
                  });
                }
              } catch (e) {
                crashlytics().recordError(e as Error);
              }
            }}>
            <TextLabel
              label="Unsubscribe"
              textStyle={{
                color: '#ffffff',
                // fontWeight: '400',
                fontFamily: 'Roboto-Regular',
              }}
            />
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  );
}
