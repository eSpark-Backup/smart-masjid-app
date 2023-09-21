import React, { useEffect, useState } from 'react';
import { View, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

import { ListEmptyComponent } from '..';
import { GapView, MasjidListCard, MyTitle } from '../../../components';
import { AllSalahTimings, Masjid } from '../../../types/masjidControllerTypes';
import { getSalahTimingsOfMasjid } from '../../../api/masjidController';
import moment from 'moment';
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
    data.map(
      item =>
        getSalahTimingsOfMasjid(item?.id.toString() ?? '').then(data => {
          let dat = [...allTimes];
          dat.push({ id: item?.id.toString(), salahs: data! });
          setAllTimes(dat);
        }),
      setLoading(false),
    );
  }, [data]);

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
    ).format('hh:mm a');

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
    ).format('hh:mm a');
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
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
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
