import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EditTimeTable, HistoryVector } from '../../../../../../assets';
import {
  GapView,
  MyDivider,
  MyText,
  ProfileAvatar,
  TimeTable,
} from '../../../../../../components';

export default function JummaTimings({
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
              <HistoryVector style={{ paddingHorizontal: 30 }} />
              <EditTimeTable />
            </View>
          </View>
        }
        headings={['Salah', 'Khutbah']}
        data={[
          { name: 'Jumma 1', iqamahTiming: '12:50' },
          { name: 'Jumma 2', iqamahTiming: '12:50' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
