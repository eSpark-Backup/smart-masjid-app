import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { FastImageProps } from 'react-native-fast-image';

import {
  AdhanSettingSvg,
  IqamaTimingsSvg,
  LocationSvg,
  MasjidSample,
  Shurooq,
  Speaker,
  SujudSvg,
  Sunrise,
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
  sunShurooqTime?: { Sunrise: string; Shurooq: string };
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
    sunShurooqTime,
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
            size={isSearch ? 14 : 16}
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
                <LocationSvg height={16} width={16} color={'#9E9F9F'} />
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
              {!sunShurooqTime ? (
                <View
                  style={{
                    ...styles.row,
                    width: '100%',
                    alignItems: 'center',
                    // flexWrap: 'wrap',
                  }}>
                  <View style={styles.row}>
                    <MyText size={16} text={namazName ?? '--'} />
                  </View>
                  <GapView mode="horizontal" />
                  <View style={styles.row}>
                    <AdhanSettingSvg height={16} width={16} color={'#9E9F9F'} />
                    <GapView mode="horizontal" length={2.5} />
                    <MyText
                      size={16}
                      text={
                        azanTime != 'Invalid date' ? (azanTime as string) : '--'
                      }
                    />
                  </View>
                  <GapView mode="horizontal" />
                  <View style={styles.row}>
                    <IqamaTimingsSvg height={13} width={13} color={'#9E9F9F'} />
                    <GapView mode="horizontal" length={2.5} />
                    <MyText
                      size={16}
                      text={
                        namazTime != 'Invalid date'
                          ? (namazTime as string)
                          : '--'
                      }
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    ...styles.row,
                    width: '100%',
                    // justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                  <View style={styles.row}>
                    <MyText size={16} text={'Sunrise'} />
                    <GapView mode="horizontal" length={5} />
                    <View style={styles.row}>
                      <MyText
                        size={16}
                        text={
                          sunShurooqTime.Sunrise != 'Invalid date'
                            ? (sunShurooqTime.Sunrise as string)
                            : '--'
                        }
                      />
                    </View>
                  </View>
                  <GapView mode="horizontal" length={15} />
                  <View style={styles.row}>
                    <MyText size={16} text={'Shurooq'} />
                    <GapView mode="horizontal" length={5} />
                    <View style={styles.row}>
                      <MyText
                        size={16}
                        text={
                          sunShurooqTime.Shurooq != 'Invalid date'
                            ? (sunShurooqTime.Shurooq as string)
                            : '--'
                        }
                      />
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        <GapView length={10} mode="horizontal" />
        {isSearch ? (
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
        ) : null}
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
