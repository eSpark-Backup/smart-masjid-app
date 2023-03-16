import React, { useMemo, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  LocationSvg,
  MasjidSample,
  MuteSvg,
  PeoplesSvg,
  SujudSvg,
  TimeCircleSvg,
  UnMuteSvg,
} from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import { GradientColors } from '../../theme';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface MasjidHomeProps {
  masjidName: string;
  namazName?: string;
  azanTime?: string;
  namazTime?: string;
  isSearch?: boolean;
  onPress?: () => void;
}

interface MasjidSearchProps {
  masjidName: string;
  location?: string;
  subscribers?: string;
  onPress?: () => void;
}

export default function MasjidListCard(
  props: MasjidHomeProps & MasjidSearchProps,
) {
  const {
    isSearch,
    masjidName,
    namazName,
    namazTime,
    azanTime,
    location,
    subscribers,
    onPress,
  } = props;

  const styles = useMemo(() => makeStyles(props), []);
  const [mute, setMute] = useState(false);
  return (
    <Card width={WINDOW_WIDTH - 38}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}>
        <View>
          <TextLabel label={masjidName ?? 'Masjid Ar - Rahman'} />
          <GapView />
          {isSearch ? (
            <>
              <View style={styles.row}>
                <LocationSvg />
                <GapView length={5} mode="horizontal" />
                <MyText
                  text={location ?? '1350 Star Ct, Plano, TX 123456'}
                  size={12}
                />
              </View>
              <GapView />
              <View style={styles.row}>
                <PeoplesSvg />
                <GapView length={5} mode="horizontal" />
                <MyText text={subscribers ?? '2561'} size={12} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.row}>
                <SujudSvg />
                <GapView mode="horizontal" length={5} />
                <MyText text={'Maghrib'} />
                <GapView mode="horizontal" length={5} />
                <View style={styles.row}>
                  {!mute ? (
                    <UnMuteSvg
                      onPress={() => {
                        setMute(!mute);
                      }}
                    />
                  ) : (
                    <MuteSvg
                      onPress={() => {
                        setMute(!mute);
                      }}
                    />
                  )}
                  <GapView mode="horizontal" length={5} />
                  <MyText text={azanTime ?? '5:50 am'} />
                </View>
                <GapView mode="horizontal" />
                <View style={styles.row}>
                  <TimeCircleSvg />
                  <GapView mode="horizontal" length={5} />
                  <MyText text={namazTime ?? '6:10 am'} />
                </View>
              </View>
            </>
          )}
        </View>
        <View>
          <Image
            source={MasjidSample}
            resizeMode="contain"
            style={styles.imageStyle}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const makeStyles = (props: MasjidHomeProps & MasjidSearchProps) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      alignItems: 'center',
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    imageStyle: { height: 60, width: 60 },
  });
};
