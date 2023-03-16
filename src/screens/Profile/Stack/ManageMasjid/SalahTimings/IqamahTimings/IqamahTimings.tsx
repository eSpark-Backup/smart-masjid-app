import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { EditTimeTable, HistoryVector } from '../../../../../../assets';
import { MyText, TimeTable } from '../../../../../../components';

export default function IqamahTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1, marginTop: 70 }}>
      <TimeTable
        header={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <MyText
              text="Change Date: 02-24-2023"
              textStyle={{ color: '#3E3E3E', fontWeight: '400', fontSize: 14 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setFlag('iHist')}>
                <HistoryVector style={{ paddingHorizontal: 30 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFlag('iEdit')}>
                <EditTimeTable />
              </TouchableOpacity>
            </View>
          </View>
        }
        headings={['Salah', 'Iqama']}
        data={[
          { name: 'Fajr', iqamahTiming: '6:00' },
          { name: 'Dhur', iqamahTiming: '1:30' },
          { name: 'Asr', iqamahTiming: '4:10' },
          { name: 'Mugrib', iqamahTiming: '5:50' },
          { name: 'Isha', iqamahTiming: '8:15' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
