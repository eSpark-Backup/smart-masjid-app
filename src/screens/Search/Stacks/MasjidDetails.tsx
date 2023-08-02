import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Animated } from 'react-native';
import {
  GapView,
  MapBox,
  MyText,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../../components';
import {
  IqamahTime,
  Masjid,
  PrayerTimes,
} from '../../../types/masjidControllerTypes';
import { AdhanCalculation, AdhanJuristic } from '../../../assets';
import {
  GetMasidAdhanTimings,
  GetMasidIqamaTimings,
} from '../../../api/search.controller';
import { _normalizedSubscriptions } from '../../../utils/functions';
import moment from 'moment';
import { WINDOW_HEIGHT } from '../../../constants';

const MasjidDetails = ({
  onSubscribe,
  masjidDetails,
  contentOpacity = 0,
}: {
  onSubscribe: () => void;
  masjidDetails?: Masjid;
  contentOpacity?: any;
}) => {
  const [subscribe, setSubscribe] = useState(false);
  const [adhanTimings, setAdhanTiming] = useState<PrayerTimes>();
  const [iqamaTimings, setIqamaTiming] = useState<IqamahTime>();

  useEffect(() => {
    GetMasidAdhanTimings(masjidDetails?.id?.toString() ?? '').then(
      (res: any) => {
        setAdhanTiming(res[0]);
      },
    );

    GetMasidIqamaTimings(masjidDetails?.id?.toString() ?? '').then(
      (res: any) => {
        setIqamaTiming(res);
      },
    );
  }, []);

  const subscriptions = _normalizedSubscriptions(
    masjidDetails?.subscriptionList,
  )?.ADHAN?.map(val => {
    return {
      name: val?.subscriptionType?.name?.toLowerCase(),
      azanTiming: adhanTimings
        ? // @ts-ignore
          adhanTimings[val?.subscriptionType?.name?.toLowerCase()] ?? '-'
        : '-',
      iqamahTiming: iqamaTimings
        ? val?.subscriptionType?.name?.toLowerCase() == 'maghrib'
          ? // @ts-ignore
            moment(adhanTimings['maghrib'], 'HH:mm:ss').add(
              'minutes',
              // @ts-ignore
              iqamaTimings[
                `${val?.subscriptionType?.name?.toLowerCase()}Delay`
              ],
            )
          : // @ts-ignore
            iqamaTimings[val?.subscriptionType?.name?.toLowerCase()] ?? '-'
        : '-',
    };
  });

  // console.log('subscriptions', iqamaTimings);

  return (
    <View
      style={{ flex: 1, alignItems: 'center'}}>
      <View style={{ alignSelf: 'center', top: 100 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Masjid Search"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <ScrollView
        style={{ top: 100 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <AdhanCalculation />
          <GapView length={5} mode="horizontal" />
          <MyText
            text="Islamic Society of North America"
            size={16}
            textStyle={{ color: '#3E3E3E' }}
          />
        </View>
        <GapView length={5} />
        <View style={{ flexDirection: 'row' }}>
          <AdhanJuristic />
          <GapView length={5} mode="horizontal" />
          <MyText
            text={`Jurisdiction: ${
              masjidDetails?.masjidAdhanConfig?.adhanJuristicConfig?.name ?? '-'
            }`}
            size={16}
            textStyle={{ color: '#3E3E3E' }}
          />
        </View>
        <GapView length={20} />
        <View style={{ padding: 10 }}>
          <TimeTable
            // @ts-ignore
            data={subscriptions}
          />
        </View>
        <GapView />
        {!subscribe ? (
          <Rounded
            onPress={onSubscribe}
            disabled={false}
            label="Subscribe"
            width={'70%'}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: 41,
              width: '70%',
              backgroundColor: '#FF6464',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            onPress={() => setSubscribe(!subscribe)}>
            <TextLabel label="Unsubscribe" textStyle={{ color: '#ffffff' }} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default MasjidDetails;
