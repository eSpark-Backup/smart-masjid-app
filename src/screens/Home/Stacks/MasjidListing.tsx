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
  const [loading, setLoading] = useState(false);
  const [allTimes, setAllTimes] = useState<AllSalahTimings[]>([]);

  useEffect(() => {
    setLoading(false);
    getSalahTimings(data);
  }, [data]);

  const getSalahTimings = (data: Masjid[]) => {
    try {
      data.map(
        item =>
          getSalahTimingsOfMasjid(
            item?.id.toString() ?? '',
            moment().format('YYYY-MM-DD'),
          ).then(data => {
            if (data) {
              let dat = [];
              dat.push({ id: item?.id.toString(), salahs: data! });
              setAllTimes(dat);
            }
          }),
        setLoading(false),
      );
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  // console.log('allTimes', JSON.stringify(allTimes));

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
                setStep(1);
                onPress(item);
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
