import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { FastImageProps } from 'react-native-fast-image';

import {
  LocationSvg,
  MasjidSample,
  Speaker,
  SujudSvg,
  TimeCircleSvg,
} from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyText from '../MyText';
import { CachedImage } from '../index';

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
    onPress,
    masjidLogo = undefined,
  } = props;

  const styles = useMemo(() => makeStyles(props), []);
  return (
    <Card width={WINDOW_WIDTH - 28} height={90}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}>
        <View
          style={{
            height: 60,
            width: WINDOW_WIDTH - 120,
            justifyContent: 'center',
          }}>
          <MyText
            text={masjidName ?? 'Masjid Ar - Rahman'}
            size={14}
            textStyle={{
              //  fontWeight: '500',
              fontFamily: 'Roboto-Medium',
            }}
            lines={2}
          />
          <GapView length={5} />
          {isSearch ? (
            <>
              <View style={styles.row}>
                <LocationSvg height={16} width={16} />
                <GapView length={5} mode="horizontal" />
                <MyText
                  text={location ?? ''}
                  size={14}
                  lines={2}
                  textStyle={{ width: WINDOW_WIDTH - 135, color: '#3E3E3E' }}
                />
              </View>
              <GapView />
            </>
          ) : (
            <>
              <View
                style={{
                  ...styles.row,
                  width: '95%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // flexWrap: 'wrap',
                }}>
                <View style={styles.row}>
                  <SujudSvg />
                  <GapView mode="horizontal" length={5} />
                  <MyText text={namazName ?? '--'} />
                </View>
                <GapView mode="horizontal" length={10} />
                <View style={styles.row}>
                  <Speaker height={20} width={20} />
                  <GapView mode="horizontal" length={5} />
                  <MyText
                    text={
                      azanTime != 'Invalid date' ? (azanTime as string) : '--'
                    }
                  />
                </View>
                <GapView mode="horizontal" length={10} />
                <View style={styles.row}>
                  <TimeCircleSvg />
                  <GapView mode="horizontal" length={5} />
                  <MyText
                    text={
                      namazTime != 'Invalid date' ? (namazTime as string) : '--'
                    }
                  />
                </View>
                <GapView mode="horizontal" length={5} />
              </View>
            </>
          )}
        </View>
        <GapView length={10} mode="horizontal" />
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
      paddingHorizontal: 10,
      alignItems: 'center',
      paddingVertical: 15,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    imageStyle: { height: 60, width: 60 },
  });
};
