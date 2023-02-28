import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ConnectedDevice, InfoCircle } from '../../../assets';
import {
  GapView,
  MyText,
  MyTitle,
  TextLabel,
  TimeTable,
} from '../../../components';
import MyDatePicker from '../../../components/MyDatePicker';

export default function MasjidDetails({ setStep }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setStep(2)}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ConnectedDevice />
        <MyText text="Connected Devices " />
      </TouchableOpacity>
      <GapView length={15} />
      <MyText text="Next Adhan in" textStyle={{ fontWeight: 'bold' }} />
      <GapView length={5} />
      <MyTitle text="06 : 09 : 00" />
      <GapView length={25} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
          padding: 5,
        }}>
        <TimeTable
          isEdit
          header={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ height: 20, width: 20 }} />
              <MyDatePicker
                onDateChange={e => {
                  console.log('onDateChange', e);
                }}
              />
              <InfoCircle />
            </View>
          }
          data={[
            {
              name: 'Fajar',
              azanTiming: '5:50',
              iqamahTiming: '6:00',
            },
            {
              name: 'Dhuhr',
              azanTiming: '1:00',
              iqamahTiming: '1:30',
            },
            {
              name: 'Asr',
              azanTiming: '4:50',
              iqamahTiming: '5:00',
            },
            {
              name: 'Mugrib',
              azanTiming: '5:50',
              iqamahTiming: '6:00',
            },
            {
              name: 'Isha',
              azanTiming: '6:50',
              iqamahTiming: '8:00',
            },
          ]}
        />
        <GapView length={20} />

        <TimeTable
          isMute
          header={
            <View
              style={{
                alignItems: 'center',
              }}>
              <TextLabel label="Jumuah" />
            </View>
          }
          headings={['Salah', 'Khutba']}
          data={[
            {
              name: 'Jumma 1',
              azanTiming: '12:10',
            },
            {
              name: 'Jumma 2',
              azanTiming: '01:10',
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
