import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  GetAdhanTimings,
  GetIqamahHistory,
} from '../../../../../../api/masjidController';
import {
  GapView,
  MyText,
  MyTextHeader,
  MyTitle,
  TextLabel,
  TimeSheet,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { masjidStore } from '../../../../../../store/MasjidStore';
import {
  AdhanTime,
  IqamahTime,
  JummahTime,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';

export default function History({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const iqamahHistory: any = useHookstate<IqamahTime[]>(
    masjidStore.iqamahHistory,
  ).get();
  const adhanTimings: any = useHookstate<AdhanTime[]>(
    masjidStore.adhanTimings,
  ).get();

  useEffect(() => {
    // GetIqamahHistory('1');
    GetAdhanTimings('2', moment().startOf('month').format('YYYY-MM-DD'));
  }, []);

  const onDateChange = (e: Date) => {
    console.log('e', e);

    // const currentIndex = data.findIndex((value: IPrayerTimeForPeriod) => {
    //   return value.date == moment(e).format('YYYY-MM-DD');
    // });

    // if (currentIndex != -1) {
    //   slider.current?.scrollToIndex({
    //     index: currentIndex,
    //     animated: true,
    //   });
    // }
  };

  console.log('iqamahHistory', iqamahHistory);
  console.log('adhanTimings', adhanTimings);
  const timingsData = [
    {
      date: '2023-08-16',
      fajr: '06:00:00',
      // fajrIqamah: '06:00:00',
      dhuhr: '14:00:00',
      asr: '18:00:00',
      maghrib: 15,
      isha: '21:30:00',
      // asrDelay: null,
      createdBy: 'User',
      createdDate: '2023-06-16T10:37:56.355+00:00',
      // dhuhrDelay: null,
      // fajrDelay: null,
      id: 9,
      // ishaDelay: null,
      // type: 'F',
    },
    {
      date: '2023-08-17',
      fajr: '06:00:00',
      // fajrIqamah: '06:00:00',
      dhuhr: '14:00:00',
      asr: '18:00:00',
      maghrib: 15,
      isha: '21:30:00',
      // asrDelay: null,
      createdBy: 'User',
      createdDate: '2023-06-17T10:37:56.355+00:00',
      // dhuhrDelay: null,
      // fajrDelay: null,
      id: 9,
      // ishaDelay: null,
      // type: 'F',
    },
    {
      date: '2023-08-18',
      fajr: '06:00:00',
      // fajrIqamah: '06:00:00',
      dhuhr: '14:00:00',
      asr: '18:00:00',
      maghrib: 15,
      isha: '21:30:00',
      // asrDelay: null,
      createdBy: 'User',
      createdDate: '2023-06-17T10:37:56.355+00:00',
      // dhuhrDelay: null,
      // fajrDelay: null,
      id: 9,
      // ishaDelay: null,
      // type: 'F',
    },
  ];

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Monthly Schedule" />
        </Animated.View>
        <GapView length={45} />
        <MyDatePicker
          minimumDate={moment().startOf('month').toDate()}
          maximumDate={moment().add(4, 'month').toDate()}
          type="standard"
          currentDate={new Date()}
          onDateChange={onDateChange}
          dateFormat={'Monthly'}
        />
        <GapView length={13} />
      </View>

      <View style={{ top: 110 }}>
        <TimeSheet data={convertResponseToData(timingsData) ?? []} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
