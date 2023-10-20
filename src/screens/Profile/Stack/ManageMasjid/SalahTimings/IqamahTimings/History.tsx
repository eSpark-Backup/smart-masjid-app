import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';

import { getSalahTimingsOfMasjid } from '../../../../../../api/masjidController';
import {
  GapView,
  MyText,
  MyTitle,
  OverlayLoader,
  TimeSheet,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { SalahTimings } from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { Email, Envelope } from '../../../../../../assets';

export default function History({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();
  const [adhaTime, setAdhaTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    getSalahTimingsOfMasjid(
      userData?.masjid.id.toString() as string,
      moment().startOf('month').format('YYYY-MM-DD'),
    ).then((timings: SalahTimings[] | undefined) => {
      convertTimings(timings);
      setLoading(false);
    });
  }, []);

  const onDateChange = (e: Date) => {
    setCurrentDate(e);
    setLoading(true);
    getSalahTimingsOfMasjid(
      userData?.masjid.id.toString() as string,
      moment(e).startOf('month').format('YYYY-MM-DD') as string,
    ).then((timings: SalahTimings[] | undefined) => {
      convertTimings(timings);
      setLoading(false);
    });

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

  const convertTimings = (timings: SalahTimings[] | undefined) => {
    let adhanTiming: any = timings?.map(item => {
      let time: any = {
        date: item.date,
      };
      item.salah.forEach(sItem => {
        time[sItem.name + ' Adhan'] = sItem.adhanTime;
        time[sItem.name + ' Iqamah'] = sItem.iqamaTime;
      });
      return time;
    });
    setAdhaTime(adhanTiming);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <OverlayLoader isShow={loading} />
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
            minimumDate={moment().startOf('month').toDate()}
            maximumDate={moment().add(4, 'month').date(1).toDate()}
            disablePicker
            type="standard"
            // currentDate={currentDate.getMonth}
            currentDate={moment()
              .month(currentDate.getMonth())
              .date(1)
              .toDate()}
            onDateChange={onDateChange}
            dateFormat={'Monthly'}
          />
          <Envelope style={{ position: 'absolute', right: 22 }} />
        </View>
        {adhaTime.length < 1 && !loading ? (
          <MyText
            textStyle={{ textAlign: 'center', marginVertical: 10 }}
            text="No schedule of current month to show!"
          />
        ) : (
          <TimeSheet data={convertResponseToData(adhaTime) ?? []} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
