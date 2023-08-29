import { Theme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
} from 'react-native';
import { SyncSvg } from '../../../assets';
import {
  GapView,
  JumuahTable,
  MyText,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  OutlineDeviceContainer,
  SwipeableTimeTable,
  TextLabel,
  TimeTable,
  Tooltip,
} from '../../../components';
import MyDatePicker from '../../../components/MyDatePicker';
import { getCurrentMonthAdhanData } from '../../../utils/functions';
import { WINDOW_WIDTH } from '../../../constants';
import { userStore } from '../../../store/UserStore';
import { Masjid } from '../../../types/masjidControllerTypes';

export default function MasjidDetails({
  setStep,
  contentOpacity,
  selectedMasjid,
}: {
  selectedMasjid?: Masjid;
  setStep: (value: any) => void;
  contentOpacity: any;
}) {
  const { colors }: Theme = useTheme();
  const [currentDeviceId, setCurrentDeviceId] = useState(1);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Masjid Subscriptions" />
        </Animated.View>
        <GapView length={50} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          top: 110,
          paddingBottom: 120,
          padding: 5,
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
          <Tooltip content="Content will show here" />
        </View>
        <GapView length={15} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={[
            {
              id: 1,
              name: 'Device 1',
              isOnline: true,
            },
            { id: 2, name: 'Device 2', isOnline: false },
            { id: 3, name: 'Device 3', isOnline: true },
            { id: 4, name: 'Device 3', isOnline: true },
            { id: 5, name: 'Device 3', isOnline: true },
          ]}
          renderItem={({ item, index }) => (
            <OutlineDeviceContainer
              onPress={() => {
                setCurrentDeviceId(item.id);
              }}
              name={item.name}
              isActive={item.id == currentDeviceId}
              isOnline={item?.isOnline}
            />
          )}
          ItemSeparatorComponent={() => <GapView mode="horizontal" />}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Salah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <SwipeableTimeTable
          isMute
          isInfo
          data={[
            {
              date: '2023-08-07',
              salah: [
                {
                  name: 'Fajr',
                  adhanTime: '04:15:00',
                  iqamaTime: '06:00:00',
                },
                {
                  name: 'Dhuhr',
                  adhanTime: '12:35:00',
                  iqamaTime: '14:00:00',
                },
                {
                  name: 'Asr',
                  adhanTime: '17:17:00',
                  iqamaTime: '18:00:00',
                },
                {
                  name: 'Maghrib',
                  adhanTime: '19:25:00',
                  iqamaTime: '19:40:00',
                },
                {
                  name: 'Isha',
                  adhanTime: '20:54:00',
                  iqamaTime: '21:30:00',
                },
              ],
            },
            {
              date: '2023-08-08',
              salah: [
                {
                  name: 'Fajr',
                  adhanTime: '04:15:00',
                  iqamaTime: '06:00:00',
                },
                {
                  name: 'Dhuhr',
                  adhanTime: '12:35:00',
                  iqamaTime: '14:00:00',
                },
                {
                  name: 'Asr',
                  adhanTime: '17:17:00',
                  iqamaTime: '18:00:00',
                },
                {
                  name: 'Maghrib',
                  adhanTime: '19:25:00',
                  iqamaTime: '19:40:00',
                },
                {
                  name: 'Isha',
                  adhanTime: '20:54:00',
                  iqamaTime: '21:30:00',
                },
              ],
            },
          ]}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Jumuah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <JumuahTable
          headings={['Salah', 'Khutba']}
          data={{
            id: 7,
            effectiveDate: '2023-07-07',
            jumuah1: '13:45:00',
            jumuah2: '15:15:00',
            jumuah3: null,
            createdBy: 'User',
            createdDate: '2023-07-05T14:26:15.946+00:00',
          }}
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
            onPress={() => {}}>
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
