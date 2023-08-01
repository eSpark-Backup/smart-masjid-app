import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native';
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

export default function MasjidDetails({ setStep, contentOpacity }: any) {
  const { colors }: Theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ alignSelf: 'center', top: 100 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel label="Masjid Subscriptions" />
        </Animated.View>
        <GapView length={50} />
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          top: 100,
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
