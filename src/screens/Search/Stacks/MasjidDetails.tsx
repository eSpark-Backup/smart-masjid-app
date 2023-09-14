import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
} from 'react-native';
import moment from 'moment';

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
  JummahTime,
  Masjid,
  PrayerTimes,
  SalahTimings,
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
import { Card } from '../../../containers';
import { useMasjid } from '../../../utils/hooks';
import {
  GetMasjidJummahTiming,
  getSalahTimingsOfMasjid,
} from '../../../api/masjidController';
import { useIsFocused } from '@react-navigation/native';

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
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const {
    store: { salahTimings, JummahTime },
  } = useMasjid();

  const getSalahTimes = async () => {
    setLoading(true);
    await getSalahTimingsOfMasjid(masjidDetails?.id.toString() ?? '');
    await GetMasjidJummahTiming(masjidDetails?.id.toString() ?? '');
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      getSalahTimes();
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <OverlayLoader isShow={loading} noBg={false} />
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
            <View
              style={{
                ...styles.infoCardRowContainer,
              }}>
              <LocationSvg />
              <GapView length={5} mode="horizontal" />
              <View style={{ maxWidth: '87%' }}>
                <MyText
                  text={
                    (masjidDetails?.address1 ?? '') +
                    (', ' + masjidDetails?.city ?? '') +
                    (' ' + masjidDetails?.state ?? '') +
                    (' ' + masjidDetails?.zip ?? '')
                  }
                  size={16}
                  textStyle={{ color: '#3E3E3E' }}
                  lines={1}
                />
              </View>
              <GapView length={5} mode="horizontal" />
              <NavigationSvg
                onPress={() => {
                  // openMap(
                  //   masjidDetails?.address1 ?? '',
                  //   masjidDetails?.city ?? '',
                  //   masjidDetails?.zip ?? '',
                  // );
                  openMap(
                    masjidDetails?.location?.coordinates[0].toString() ?? '',
                    masjidDetails?.location?.coordinates[1].toString() ?? '',
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
        <GapView length={15} />
        <MyTextSubHeader text="Salah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <SalahTable
          // @ts-ignore
          data={salahTimings}
        />
        <GapView length={15} />
        <MyTextSubHeader text="Jumuah Timings" style={{ color: '#3E3E3E' }} />
        <GapView length={15} />
        <JumuahTable
          headings={['Salah', 'Khutba']}
          data={JummahTime as JummahTime}
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
