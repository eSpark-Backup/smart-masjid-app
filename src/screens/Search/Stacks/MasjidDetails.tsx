import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  GapView,
  JumuahTable,
  MyText,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  Rounded,
  SalahTable,
  TextLabel,
  Tooltip,
} from '../../../components';
import {
  JummahTime,
  Masjid,
  SalahTimings,
} from '../../../types/masjidControllerTypes';
import {
  AdhanCalculation,
  AdhanJuristic,
  LocationSvg,
  NavigationSvg,
  OpenLink,
  Phone,
  Web,
} from '../../../assets';
import { _normalizedSubscriptions, openMap } from '../../../utils/functions';
import { Card } from '../../../containers';
import { useMasjid } from '../../../utils/hooks';
import {
  GetMasjidCurrentJummahTiming,
  getSalahTimingsOfMasjid,
} from '../../../api/masjidController';
import { WINDOW_WIDTH } from '../../../constants';
import moment from 'moment';
import { GlobalProps } from '../../../types';
import { State, useHookstate } from '@hookstate/core';
import { globalStore } from '../../../store/GlobalStates';
import { parsePhoneNumber } from 'libphonenumber-js';

const MasjidDetails = ({
  onSubscribe,
  masjidDetails,
  contentOpacity = 0,
}: {
  onSubscribe: () => void;
  masjidDetails?: Masjid;
  contentOpacity?: any;
}) => {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [salahTimings, setSalahTimings] = useState<SalahTimings[]>([]);
  const isFocused = useIsFocused();

  const {
    store: { JummahTime },
  } = useMasjid();

  const getSalahTimes = async () => {
    try {
      state.globalLoading.set(true);
      // setLoading(true);
      await getSalahTimingsOfMasjid(
        masjidDetails?.id.toString() ?? '',
        moment().format('YYYY-MM-DD').toString(),
      ).then(data => setSalahTimings(data!));
      await GetMasjidCurrentJummahTiming(masjidDetails?.id.toString() ?? '');
      state.globalLoading.set(false);
      // setLoading(false);
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  // const adhanCalculations = (): string => {
  //   let masjidAdhanCalcConfig =
  //     masjidDetails?.masjidAdhanConfig.adhanCalcConfig;
  //   let masjidAdhanCustomConfig =
  //     masjidDetails?.masjidAdhanConfig.adhanCustomConfig;
  //   let toolTip = '';
  //   if (!masjidDetails?.masjidAdhanConfig.adhanCustomConfig) {
  //     toolTip = `This masjid uses ${masjidAdhanCalcConfig?.name} for Adhan calculation. ${masjidAdhanCalcConfig?.calculation}`;
  //     return toolTip;
  //   } else {
  //     toolTip = `This masjid uses ${
  //       masjidAdhanCalcConfig?.name
  //     } for Adhan calculation. Fajr: ${
  //       masjidAdhanCustomConfig?.fajrAngle
  //     }° Maghrib: ${masjidAdhanCustomConfig?.maghribValue} ${
  //       masjidAdhanCustomConfig?.maghribRule == 'ANGLE' ? '°' : 'mins'
  //     } Isha: ${masjidAdhanCustomConfig?.ishaValue} ${
  //       masjidAdhanCustomConfig?.ishaRule == 'ANGLE' ? '°' : 'mins'
  //     }`;
  //     return toolTip;
  //   }
  // };

  function formatPhoneNumber(phoneNumber: number) {
    // Remove non-numeric characters from the phone number
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Check if the cleaned phone number has a valid length
    const isValidLength = cleaned?.length === 10 || cleaned?.length === 11;

    if (isValidLength) {
      // Format the phone number in (XXX) XXX-XXXX format
      const formattedNumber = cleaned.replace(
        /(\d{3})(\d{3})(\d{4})/,
        '($1) $2-$3',
      );

      // If there's an extra digit, it's probably a country code. Add a '+' in that case.
      return cleaned?.length === 11 ? '+' + formattedNumber : formattedNumber;
    } else {
      // Return the original input if it doesn't have a valid length
      return phoneNumber;
    }
  }

  useEffect(() => {
    if (isFocused) {
      getSalahTimes();
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {/* <OverlayLoader isShow={loading} noBg={false} /> */}
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
          <MyTitle text="Masjid Search" />
        </Animated.View>
      </View>

      <View style={{ paddingVertical: 10 }}>
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
              <View style={{ maxWidth: '80%' }}>
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
              <TouchableOpacity
                onPress={() => {
                  openMap(
                    masjidDetails?.location?.coordinates[0].toString() ?? '',
                    masjidDetails?.location?.coordinates[1].toString() ?? '',
                  );
                }}>
                <NavigationSvg />
              </TouchableOpacity>
            </View>
            <GapView length={5} />
            {/* <View style={styles.infoCardRowContainer}>
              <AdhanCalculation />
              <GapView length={5} mode="horizontal" />
              <View style={{ maxWidth: '80%' }}>
                <MyText
                  text={
                    masjidDetails?.masjidAdhanConfig.adhanCalcConfig.name ?? ''
                  }
                  size={16}
                  textStyle={{ color: '#3E3E3E' }}
                  lines={1}
                />
              </View>
              <GapView length={5} mode="horizontal" />
              <Tooltip content={adhanCalculations()} />
            </View> */}
            {masjidDetails?.website ? (
              <View style={styles.infoCardRowContainer}>
                <Web />
                <GapView length={5} mode="horizontal" />
                <View style={{ maxWidth: '80%' }}>
                  <MyText
                    text={masjidDetails?.website}
                    size={16}
                    textStyle={{ color: '#3E3E3E' }}
                    lines={1}
                  />
                </View>
                <GapView length={5} mode="horizontal" />
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://${masjidDetails?.website as string}`,
                    )
                  }>
                  <OpenLink width={18} height={18} />
                </TouchableOpacity>
              </View>
            ) : null}
            <GapView length={5} />
            {/* <View style={styles.infoCardRowContainer}>
              <AdhanJuristic />
              <GapView length={5} mode="horizontal" />
              <View style={{ maxWidth: '80%' }}>
                <MyText
                  text={
                    masjidDetails?.masjidAdhanConfig?.adhanJuristicConfig
                      ?.name ?? 'undefined'
                  }
                  size={16}
                  textStyle={{ color: '#3E3E3E' }}
                  lines={1}
                />
              </View>
              <GapView length={5} mode="horizontal" />
              <Tooltip
                content={`This masjid uses ${masjidDetails?.masjidAdhanConfig?.adhanJuristicConfig?.name} fiqh for Asr time calculation.`}
              />
            </View> */}
            {masjidDetails?.phone ? (
              <View style={styles.infoCardRowContainer}>
                <Phone />
                <GapView length={5} mode="horizontal" />
                <View style={{ maxWidth: '80%' }}>
                  <MyText
                    text={parsePhoneNumber(
                      masjidDetails?.phone,
                    ).formatInternational()}
                    size={16}
                    textStyle={{ color: '#3E3E3E' }}
                    lines={1}
                  />
                </View>
                <GapView length={5} mode="horizontal" />
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${masjidDetails?.phone}`)
                  }>
                  <OpenLink width={18} height={18} />
                </TouchableOpacity>
              </View>
            ) : null}
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
          headings={['Salah', 'Khutbah']}
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
      </View>
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
