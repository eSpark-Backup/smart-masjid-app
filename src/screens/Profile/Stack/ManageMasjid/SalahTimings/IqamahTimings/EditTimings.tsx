import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import {
  GapView,
  MyDropDown,
  MyText,
  TimeTable,
} from '../../../../../../components';

export default function EditIqamah({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <ScrollView
      style={{ flex: 1, marginTop: 60 }}
      contentContainerStyle={{ paddingVertical: 10 }}>
      <TimeTable
        header={
          <View style={{ marginBottom: 20 }}>
            <MyDropDown
              title=""
              containerPadding={0}
              placeholder="Muslim World League"
              placeholderColor="#CFCFCF"
              items={[
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' },
              ]}
            />
            <GapView />
            <MyDropDown
              title=""
              containerPadding={0}
              placeholder="Muslim World League"
              placeholderColor="#CFCFCF"
              items={[
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' },
              ]}
            />
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
        btnLabel={'Save'}
        onButtonPress={() => console.log('some')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
