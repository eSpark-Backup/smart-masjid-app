import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SyncSvg } from '../../../assets';
import {
  GapView,
  MyText,
  MyTitle,
  SwipeableTimeTable,
  TextLabel,
  TimeTable,
} from '../../../components';
import MyDatePicker from '../../../components/MyDatePicker';
import { getCurrentMonthAdhanData } from '../../../utils/functions';

export default function MasjidDetails({ setStep }: any) {
  const { colors }: Theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setStep(2)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MyText text="MY HOME DEVICE " textStyle={{ color: colors.primary }} />
        <SyncSvg />
      </TouchableOpacity>
      {/* <GapView length={15} />
      <MyText text="Next Adhan in" textStyle={{ fontWeight: 'bold' }} />
      <GapView length={5} />
      <MyTitle text="06 : 09 : 00" style={{ fontSize: 32 }} /> */}
      <GapView length={30} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
          padding: 5,
        }}>
        <SwipeableTimeTable isMute isInfo data={getCurrentMonthAdhanData()} />
        <GapView length={20} />

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
        <GapView length={20} />
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
