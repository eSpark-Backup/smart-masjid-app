import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MyText, TimeSheet } from '../../../../../../components';

export default function History({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1, marginTop: 70, alignItems: 'center' }}>
      <MyText
        text="Iqama history"
        textStyle={{ fontWeight: '400', fontSize: 16 }}
      />
      <TimeSheet
        data={[
          {
            heading: 'Change Date',
            values: ['12/02/2021', '12/02/2021', '12/02/2021'],
          },
          {
            heading: 'Fajr',
            values: ['06:00', '06:00', '06:00'],
          },
          {
            heading: 'Dhur',
            values: ['06:00', '06:00', '06:00'],
          },
          {
            heading: 'Asr',
            values: ['06:00', '06:00', '06:00'],
          },
          {
            heading: 'Mugrib',
            values: ['06:00', '06:00', '06:00'],
          },
          {
            heading: 'Isha',
            values: ['06:00', '06:00', '06:00'],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
