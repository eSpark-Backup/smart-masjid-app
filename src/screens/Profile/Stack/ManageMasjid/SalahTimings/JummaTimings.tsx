import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  GapView,
  MyDivider,
  ProfileAvatar,
  TimeTable,
} from '../../../../../components';

export default function JummaTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <TimeTable
        isEdit
        headings={['Salah', 'Khutbah']}
        data={[
          { name: 'Jummah 1', azanTiming: '12:50' },
          { name: 'Jummah 1', azanTiming: '12:50' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
