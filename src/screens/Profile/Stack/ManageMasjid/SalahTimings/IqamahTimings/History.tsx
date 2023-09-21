import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  GetAdhanTimings,
  GetIqamahHistory,
  getSalahTimingsOfMasjid,
} from '../../../../../../api/masjidController';
import {
  GapView,
  MyText,
  MyTextHeader,
  MyTitle,
  OverlayLoader,
  TextLabel,
  TimeSheet,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { masjidStore } from '../../../../../../store/MasjidStore';
import {
  AdhanTime,
  IqamahTime,
  JummahTime,
  Salah,
  SalahTimings,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';

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

  useEffect(() => {
    setLoading(true);
    getSalahTimingsOfMasjid(userData?.masjid.id.toString() as string).then(
      (timings: SalahTimings[] | undefined) => {
        convertTimings(timings);
        setLoading(false);
      },
    );
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
        <MyDatePicker
          minimumDate={moment().startOf('month').toDate()}
          maximumDate={moment().add(4, 'month').toDate()}
          type="standard"
          currentDate={new Date()}
          onDateChange={onDateChange}
          dateFormat={'Monthly'}
        />
        <GapView length={10} />
        {adhaTime.length < 1 && !loading ? (
          <MyText
            textStyle={{ textAlign: 'center', marginVertical: 10 }}
            text="Nothing to show yet!"
          />
        ) : (
          <TimeSheet data={convertResponseToData(adhaTime) ?? []} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
