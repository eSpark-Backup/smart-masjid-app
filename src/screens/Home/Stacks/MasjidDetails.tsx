import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
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
  MyText,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  OutlineDeviceContainer,
  SwipeableTimeTable,
  TextLabel,
  TimeTable,
} from '../../../components';
import MyDatePicker from '../../../components/MyDatePicker';
import { getCurrentMonthAdhanData } from '../../../utils/functions';

export default function MasjidDetails({ setStep, contentOpacity }: any) {
  const { colors }: Theme = useTheme();
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
          paddingBottom: 20,
          padding: 5,
          paddingHorizontal: 15,
        }}>
        <MyTextHeader text="East Plano Islamic Center" />
        <GapView length={15} />
        <MyTextSubHeader
          text="Connected Devices"
          style={{ color: '#3E3E3E' }}
        />
        <GapView length={15} />
        <FlatList
          horizontal
          data={[
            {
              name: 'Device 1 Device 1 Device 1',
              isActive: true,
              isOnline: true,
            },
            { name: 'Device 2', isActive: false, isOnline: false },
            { name: 'Device 3', isActive: false, isOnline: true },
          ]}
          renderItem={({ item, index }) => (
            <OutlineDeviceContainer
              name={item.name}
              isActive={item?.isActive}
              isOnline={item?.isOnline}
            />
          )}
          ItemSeparatorComponent={() => <GapView mode="horizontal" />}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Salah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <SwipeableTimeTable isMute isInfo data={getCurrentMonthAdhanData()} />
        <GapView length={15} />
        <MyTextSubHeader
          text="Jumuah Timings"
          style={{ color: '#3E3E3E' }}
        />
        <GapView length={15} />
        <TimeTable
          isMute
          header={
            <View
              style={{
                alignItems: 'center',
              }}>
              <MyText
                text="Jumuah"
                size={16}
                textStyle={{ fontWeight: '700' }}
              />
            </View>
          }
          headings={['Salah', 'Khutba']}
          data={[
            {
              name: 'Jumuah 1',
              azanTiming: '12:10',
            },
            {
              name: 'Jumuah 2',
              azanTiming: '01:10',
            },
          ]}
        />
        <GapView length={15} />
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 41,
            width: '70%',
            backgroundColor: '#FF6464',
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {}}>
          <TextLabel label="Unsubscribe" textStyle={{ color: '#ffffff' }} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
