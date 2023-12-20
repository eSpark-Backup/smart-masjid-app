import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  generatePDf,
  getSalahTimingsOfMasjid,
} from '../../../../../../api/masjidController';
import {
  GapView,
  LogoutModal,
  MyModal,
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
import { Download, Mail } from '../../../../../../assets';

export default function History({
  contentOpacity = 0,
}: {
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();
  const [adhaTime, setAdhaTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prompt1, setPrompt1] = useState(false);
  const [prompt2, setPrompt2] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSalahTimingsOfMasjid(
      userData?.masjid.id.toString() as string,
      moment().startOf('month').format('YYYY-MM-DD'),
      'MONTH',
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
      'MONTH',
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
        time[sItem.name + ' Iqama'] = sItem.iqamaTime;
      });
      return time;
    });
    setAdhaTime(adhanTiming);
  };

  const sendPDFtoEmail = (email: string) => {
    setPrompt1(false);
    setLoading(true);
    generatePDf(
      userData?.masjid.id.toString() as string,
      moment(currentDate).startOf('month').format('YYYY-MM-DD') as string,
      true,
      [userData?.email!, email],
    ).then(path => {
      setPrompt2(true);
      setLoading(false);
    });
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
      {/* <LogoutModal
        visible={prompt1}
        message={`Monthly Schedule will emailed to ${userData?.email}. Would you like to add an optional email?`}
        onClose={sendPDFtoEmail}
      /> */}
      <MyModal
        visible={prompt1}
        onSend={email => sendPDFtoEmail(email)}
        message={`Monthly Schedule will emailed to ${userData?.email}.`}
        title1="Send"
      />
      <LogoutModal
        visible={prompt2}
        message={`Monthly Schedule sent successfully.\nWould you like to download the PDF as well?`}
        onClose={() => setPrompt2(false)}
      />
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
            minimumDate={moment().startOf('month').date(2).toDate()}
            maximumDate={moment().add(4, 'month').date(1).toDate()}
            disablePicker
            type="standard"
            // currentDate={currentDate.getMonth}
            currentDate={moment()
              .year(currentDate.getFullYear())
              .month(currentDate.getMonth())
              .date(1)
              .toDate()}
            onDateChange={onDateChange}
            dateFormat={'Monthly'}
          />
          <View
            style={{
              position: 'absolute',
              right: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => setPrompt1(true)}>
              <Mail />
            </TouchableOpacity>
            <GapView mode="horizontal" />
            <TouchableOpacity>
              <Download />
            </TouchableOpacity>
          </View>
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
