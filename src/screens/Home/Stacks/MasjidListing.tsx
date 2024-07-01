import React, { useEffect, useState } from 'react';
import { View, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import crashlytics from '@react-native-firebase/crashlytics';

import { ListEmptyComponent } from '..';
import { GapView, MasjidListCard, MyTitle } from '../../../components';
import { AllSalahTimings, Masjid } from '../../../types/masjidControllerTypes';
import { getSalahTimingsOfMasjid } from '../../../api/masjidController';
import { WINDOW_WIDTH } from '../../../constants';
import { Text } from 'react-native-animatable';
import { useHookstate } from '@hookstate/core';
import { userStore } from '../../../store/UserStore';
import { GetMonthlySchedule } from '../../../api/userController';

export default function MasjidListing({
  data,
  setStep = () => {},
  contentOpacity = 0,
  onPress,
}: {
  data: Masjid[];
  setStep: any;
  contentOpacity?: Animated.AnimatedInterpolation<string | number> | number;
  onPress: (data: Masjid) => void;
}) {
  const navigation = useNavigation();
  const [allTimes, setAllTimes] = useState<AllSalahTimings[]>([]);
  const schedule = useHookstate(userStore.monthlySchedule);

  useEffect(() => {
    getSalahTimings(data);
  }, [data]);

  const getSalahTimings = (data: Masjid[]) => {
    try {
      let dat: AllSalahTimings[] = [];
      data?.map(async item => {
        const salahRes = await getSalahTimingsOfMasjid(
          item?.id.toString() ?? '',
          moment().format('YYYY-MM-DD'),
        );
        dat.push({ id: item?.id.toString(), salahs: salahRes! });
        if (dat?.length == data?.length) {
          setAllTimes(dat);
        }
      });
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const getAzanNameTime = (id: string, type?: string) => {
    let masjidInd = allTimes?.findIndex(item => item?.id == id);
    let currTimes = allTimes[masjidInd]?.salahs[0];
    let currInd = currTimes?.salah.findIndex(item => {
      let time1 = item?.adhanTime?.toString().slice(0, 5);
      let time2 = moment().format('HH:mm');
      return time1 >= time2;
    });
    let name = currTimes?.salah[currInd < 0 ? 0 : currInd]?.name;
    let time = moment(
      currTimes?.salah[currInd < 0 ? 0 : currInd]?.adhanTime,
      'hh:mm:ss',
    ).format('hh:mm');

    if (type == 'name') {
      return name;
    } else {
      return time;
    }
  };

  const getIqamaTime = (id: string) => {
    let masjidInd = allTimes?.findIndex(item => item?.id == id);
    let currTimes = allTimes[masjidInd]?.salahs[0];
    let currInd = currTimes?.salah.findIndex(item => {
      let time1 = item?.adhanTime?.toString().slice(0, 5);
      let time2 = moment().format('HH:mm');
      return time1 >= time2;
    });
    let time = moment(
      currTimes?.salah[currInd < 0 ? 0 : currInd]?.iqamaTime,
      'hh:mm:ss',
    ).format('hh:mm');
    return time;
  };

  // console.log('allTimes', JSON.stringify(allTimes));
  const getScheduleData = async (masjidId: number, item: any) => {
    onPress(item);
    const res = await GetMonthlySchedule(masjidId);
    if (res) {
      schedule.set(res);
      setStep(1);
    } else {
      schedule.set(null);
      setStep(1);
    }
  };

  return (
    <View>
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
          <MyTitle text="Masjid Subscriptions" />
        </Animated.View>
      </View>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingVertical: 10 }}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        renderItem={({ item, index }) => {
          return (
            <MasjidListCard
              key={index}
              onPress={() => {
                getScheduleData(item.id, item);
              }}
              masjidName={item.name ?? ''}
              masjidLogo={item.logo ? { uri: item.logo } : undefined}
              namazName={getAzanNameTime(item.id.toString(), 'name')}
              azanTime={getAzanNameTime(item.id.toString())}
              namazTime={getIqamaTime(item.id.toString())}
            />
          );
        }}
        ItemSeparatorComponent={GapView}
        ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
      />
    </View>
  );
}
