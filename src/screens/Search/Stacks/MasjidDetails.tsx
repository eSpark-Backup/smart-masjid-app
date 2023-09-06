import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Animated } from 'react-native';
import {
  GapView,
  JumuahTable,
  MapBox,
  MyText,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  Rounded,
  SalahTable,
  TextLabel,
  TimeTable,
  Tooltip,
} from '../../../components';
import {
  IqamahTime,
  Masjid,
  PrayerTimes,
  SubscriptionList,
} from '../../../types/masjidControllerTypes';
import {
  AdhanCalculation,
  AdhanJuristic,
  LocationSvg,
  NavigationSvg,
} from '../../../assets';
import {
  GetMasidAdhanTimings,
  GetMasidIqamaTimings,
} from '../../../api/search.controller';
import { _normalizedSubscriptions, openMap } from '../../../utils/functions';
import moment from 'moment';
import { Card } from '../../../containers';
import { StyleSheet } from 'react-native';

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

  useEffect(() => {
    console.log('ka', subscribe);
  }, [subscribe]);

  const subscriptions = [] as SubscriptionList[];
  // _normalizedSubscriptions(
  //   masjidDetails?.subscriptionList,
  // )?.ADHAN?.map(val => {
  //   return {
  //     name: val?.subscriptionType?.name?.toLowerCase(),
  //     azanTiming: adhanTimings
  //       ? // @ts-ignore
  //         adhanTimings[val?.subscriptionType?.name?.toLowerCase()] ?? '-'
  //       : '-',
  //     iqamahTiming: iqamaTimings
  //       ? val?.subscriptionType?.name?.toLowerCase() == 'maghrib'
  //         ? // @ts-ignore
  //           moment(adhanTimings['maghrib'], 'HH:mm:ss').add(
  //             'minutes',
  //             // @ts-ignore
  //             iqamaTimings[
  //               `${val?.subscriptionType?.name?.toLowerCase()}Delay`
  //             ],
  //           )
  //         : // @ts-ignore
  //           iqamaTimings[val?.subscriptionType?.name?.toLowerCase()] ?? '-'
  //       : '-',
  //   };
  // });

  console.log('subscriptions', masjidDetails);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ alignSelf: 'center', top: 100 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Masjid Search" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          top: 110,
          paddingBottom: 130,
          padding: 5,
          paddingHorizontal: 15,
        }}>
        <MyTextHeader text={masjidDetails?.name ?? ''} />
        <GapView length={15} />
        <Card>
          <View style={{ padding: 10 }}>
            <View style={styles.infoCardRowContainer}>
              <LocationSvg />
              <GapView length={5} mode="horizontal" />
              <View style={{ maxWidth: '87%' }}>
                <MyText
                  text={masjidDetails?.address1 ?? ''}
                  size={16}
                  textStyle={{ color: '#3E3E3E' }}
                  lines={1}
                />
              </View>
              <GapView length={5} mode="horizontal" />
              <NavigationSvg
                onPress={() => {
                  openMap(
                    masjidDetails?.address1 ?? '',
                    masjidDetails?.city ?? '',
                    masjidDetails?.zip ?? '',
                  );
                }}
              />
            </View>
            <GapView length={5} />
            <View style={styles.infoCardRowContainer}>
              <AdhanCalculation />
              <GapView length={5} mode="horizontal" />
              <View style={{ maxWidth: '87%' }}>
                <MyText
                  text={'Islamic Society of North America' ?? ''}
                  size={16}
                  textStyle={{ color: '#3E3E3E' }}
                  lines={2}
                />
              </View>
              <GapView length={5} mode="horizontal" />
              <Tooltip content="Check this out" />
            </View>
            <GapView length={5} />
            <View style={styles.infoCardRowContainer}>
              <AdhanJuristic />
              <GapView length={5} mode="horizontal" />
              <View style={{ maxWidth: '87%' }}>
                <MyText
                  text={
                    masjidDetails?.masjidAdhanConfig?.adhanJuristicConfig
                      ?.name ?? 'undefined'
                  }
                  size={16}
                  textStyle={{ color: '#3E3E3E' }}
                  lines={2}
                />
              </View>
              <GapView length={5} mode="horizontal" />
              <Tooltip content="Check this out" />
            </View>
          </View>
        </Card>
        <GapView length={20} />
        <SalahTable
          // @ts-ignore
          data={[
            {
              date: '2023-08-07',
              salah: [
                {
                  name: 'Fajr',
                  adhanTime: '04:15:00',
                  iqamaTime: '06:00:00',
                },
                {
                  name: 'Dhuhr',
                  adhanTime: '12:35:00',
                  iqamaTime: '14:00:00',
                },
                {
                  name: 'Asr',
                  adhanTime: '17:17:00',
                  iqamaTime: '18:00:00',
                },
                {
                  name: 'Maghrib',
                  adhanTime: '19:25:00',
                  iqamaTime: '19:40:00',
                },
                {
                  name: 'Isha',
                  adhanTime: '20:54:00',
                  iqamaTime: '21:30:00',
                },
              ],
            },
          ]}
        />

        <GapView length={15} />
        <MyTextSubHeader text="Jumuah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <JumuahTable
          headings={['Salah', 'Khutba']}
          data={{
            id: 7,
            effectiveDate: '2023-07-07',
            jumuah1: '13:45:00',
            jumuah2: '15:15:00',
            jumuah3: null,
            createdBy: 'User',
            createdDate: '2023-07-05T14:26:15.946+00:00',
          }}
          isMute={false}
        />
        <GapView length={15} />

        {!subscribe ? (
          <View style={{ alignItems: 'center' }}>
            <Rounded
              onPress={onSubscribe}
              disabled={false}
              label="Subscribe"
              width={'70%'}
            />
          </View>
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

const styles = StyleSheet.create({
  infoCardRowContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
});
export default MasjidDetails;
