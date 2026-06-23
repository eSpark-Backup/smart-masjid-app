import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  getJummahTimingsOfMasjid,
  getSalahTimingsOfMasjid,
} from '../../../../../../api/masjidController';
import {
  GapView,
  MyText,
  MyTitle,
  TimeSheet,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import {
  JumuahTimings,
  SalahTimings,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { globalStore } from '../../../../../../store/GlobalStates';
import { GlobalProps } from '../../../../../../types';

export default function History({
  contentOpacity = 0,
  setFlag,
  masjidId,
  currDate,
}: {
  contentOpacity?: any;
  setFlag: (value: string) => void;
  masjidId?: number;
  currDate: Date;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();

  const [adhaTime, setAdhaTime] = useState([]);
  const [jummaTime, setJummaTime] = useState<JumuahTimings[] | []>([]);

  useEffect(() => {
    state.globalLoading.set(true);
    getSalahTimingsOfMasjid(
      masjidId?.toString() ?? (userData?.masjid?.id.toString() as string),
      moment(currDate).startOf('month').format('YYYY-MM-DD'),
      'MONTH',
    ).then((timings: SalahTimings[] | undefined) => {
      convertTimings(timings);
      getJummahTimingsOfMasjid(
        masjidId?.toString() ?? (userData?.masjid?.id.toString() as string),
        moment(currDate).startOf('month').format('YYYY-MM-DD'),
      ).then((timings: JumuahTimings[] | undefined) => {
        setJummaTime(timings!);
        state.globalLoading.set(false);
      });
    });
  }, []);

  const convertTimings = (timings: SalahTimings[] | undefined) => {
    let adhanTiming: any = timings?.map(item => {
      let time: any = {
        date: item.date,
      };
      item.salah.forEach(sItem => {
        time[sItem.name + ' Adhan'] = moment(
          sItem.adhanTime,
          'HH:mm:ss',
        ).format('hh:mm:ss');
        time[sItem.name + ' Iqama'] = moment(
          sItem.iqamaTime,
          'HH:mm:ss',
        ).format('hh:mm:ss');
      });
      return time;
    });
    setAdhaTime(adhanTiming);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Monthly Schedule" />
        </Animated.View>
      </View>
      <View>
        <GapView />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: WINDOW_WIDTH,
          }}>
          <MyDatePicker
            disablePicker
            type="standard"
            hideChevs
            currentDate={moment()
              .year(currDate.getFullYear())
              .month(currDate.getMonth())
              .date(1)
              .toDate()}
            dateFormat={'Monthly'}
          />
        </View>
        {adhaTime?.length < 1 && !state.globalLoading.get() ? (
          <MyText
            textStyle={{ textAlign: 'center', marginVertical: 10 }}
            text="No schedule of current month to show!"
          />
        ) : (
          <TimeSheet
            data={convertResponseToData(adhaTime) ?? []}
            jummaData={jummaTime}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
