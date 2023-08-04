import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageRequireSource,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  LocationSvg,
  MasjidSample,
  MuteSvg,
  PeoplesSvg,
  Speaker,
  SujudSvg,
  TimeCircleSvg,
  UnMuteSvg,
} from '../../assets';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import { GradientColors } from '../../theme';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import { ImageSourcePropType } from 'react-native';
import { CachedImage } from '../index';
import { FastImageProps } from 'react-native-fast-image';

interface MasjidHomeProps {
  masjidName: string;
  namazName?: string;
  azanTime?: string;
  namazTime?: string;
  isSearch?: boolean;
  onPress?: () => void;
  masjidLogo?: ImageSourcePropType;
}

interface MasjidSearchProps {
  masjidName: string;
  location?: string;
  subscribers?: string;
  onPress?: () => void;
  masjidLogo?: ImageSourcePropType;
}

type ImageSource = FastImageProps['source'] & string & ImageSourcePropType;

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
    masjidLogo = undefined,
  } = props;

  const styles = useMemo(() => makeStyles(props), []);
  const [mute, setMute] = useState(false);
  return (
    <Card width={WINDOW_WIDTH - 28}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}>
        <View>
          <MyText
            text={masjidName ?? 'Masjid Ar - Rahman'}
            size={16}
            textStyle={{ fontWeight: '700' }}
          />
          <GapView />
          {isSearch ? (
            <>
              <View style={styles.row}>
                <LocationSvg />
                <GapView length={5} mode="horizontal" />
                <MyText
                  text={location ?? ''}
                  size={12}
                  textStyle={{ width: WINDOW_WIDTH - 150, color: '#3E3E3E' }}
                />
              </View>
              <GapView />
              <View style={styles.row}>
                <PeoplesSvg />
                <GapView length={5} mode="horizontal" />
                <MyText
                  text={subscribers ?? '2561'}
                  size={12}
                  textStyle={{ color: '#3E3E3E' }}
                />
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  ...styles.row,
                  width: '95%',
                  alignItems: 'center',
                  // flexWrap: 'wrap',
                }}>
                <SujudSvg />
                <GapView mode="horizontal" length={5} />
                <MyText text={'Maghrib'} />
                <GapView mode="horizontal" length={10} />
                <View style={styles.row}>
                  <Speaker height={20} width={20} />
                  <GapView mode="horizontal" length={5} />
                  <MyText text={azanTime ?? '5:50 am'} />
                </View>
                <GapView mode="horizontal" length={10} />
                <View style={styles.row}>
                  <TimeCircleSvg />
                  <GapView mode="horizontal" length={5} />
                  <MyText text={namazTime ?? '6:10 am'} />
                </View>
                <GapView mode="horizontal" length={5} />
              </View>
            </>
          )}
        </View>
        <View>
          {masjidLogo ? (
            <CachedImage
              source={masjidLogo as ImageSource}
              resizeMode="contain"
              style={
                !isSearch
                  ? styles.imageStyle
                  : { height: 61, width: 61, borderRadius: 6 }
              }
            />
          ) : (
            <MasjidSample />
          )}
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
      padding: 10,
      alignItems: 'center',
      paddingVertical: 15,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    imageStyle: { height: 60, width: 60 },
  });
};
