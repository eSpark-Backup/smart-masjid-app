import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMachine } from '@xstate/react';

import {
  GapView,
  MyDivider,
  ProfileAvatar,
  TimeTable,
} from '../../../../../components';
import jokeMachine from '../../../../../store/NewMachine';

export default function IqamahTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [state, send] = useMachine(jokeMachine);

  useEffect(() => {
    send('FETCH_JOKE');
  }, []);

  if (state.value === 'loaded') {
    console.log('data', state.context.joke);
    console.log('data', state.context.empty);
  }

  return (
    <View style={{ flex: 1 }}>
      <ProfileAvatar />
      <GapView length={20} />
      <TimeTable
        isEdit
        data={[
          { name: 'Fajr', azanTiming: '5:50', iqamahTiming: '6:00' },
          { name: 'Dhur', azanTiming: '1:00', iqamahTiming: '1:30' },
          { name: 'Asr', azanTiming: '3:50', iqamahTiming: '4:10' },
          { name: 'Mugrib', azanTiming: '5:45', iqamahTiming: '5:50' },
          { name: 'Isha', azanTiming: '7:50', iqamahTiming: '8:15' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
