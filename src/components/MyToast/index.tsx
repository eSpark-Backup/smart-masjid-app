import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { CautionDevice, Check, CheckSvg, CrossC, OpenLink } from '../../assets';
import { Rounded } from '../Buttons';
import MyText from '../MyText';
import GapView from '../GapView';
import MyTitle from '../MyTitle';
import MyTextSubHeader from '../MyTextSubHeader';
import { WINDOW_WIDTH } from '../../constants';
import { _requestUserLocationPermission } from '../../utils/functions';

export default function MyToast({
  heading,
  title,
  message,
  isSuccess = true,
  btnText,
  onPress,
  onSkip,
  points,
  center,
  titleSize,
  contentOpacity,
}: {
  heading?: string;
  title: string;
  message: string;
  isSuccess: boolean;
  btnText: string;
  onPress?: () => void;
  onSkip?: () => void;
  points?: string[];
  center?: boolean;
  titleSize?: number;
  contentOpacity: any;
}) {
  const startValue = useRef(new Animated.Value(0)).current;
  const { colors }: Theme = useTheme();
  const endValue = 1;

  useEffect(() => {
    Animated.spring(startValue, {
      toValue: endValue,
      friction: 3,
      useNativeDriver: true,
      tension: 10,
    }).start();
  }, []);
  return (
    <Animatable.View animation="bounceInUp" duration={1100}>
      <Animated.View
        style={[
          {
            transform: [
              {
                scale: startValue,
              },
            ],
          },
        ]}>
        <View style={styles.container}>
          {heading && (
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
                <MyTitle text={heading} />
              </Animated.View>
            </View>
          )}
          <GapView />
          {title && (
            <MyTextSubHeader
              text={title!!}
              style={{
                textAlign: 'center',
              }}
            />
          )}
          <View
            style={{
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: message || points?.length!! > 0 ? 50 : 0,
            }}>
            {isSuccess ? <CheckSvg /> : <CautionDevice />}
          </View>
          {message && (
            <View
              style={
                center ? { alignItems: 'center' } : { alignItems: 'flex-start' }
              }>
              <MyText
                size={16}
                text={message}
                textStyle={{
                  color: isSuccess ? '#3E3E3E' : '#000000',
                  fontFamily: isSuccess ? 'Roboto-Regular' : 'Roboto-Medium',
                  fontSize: 16,
                }}
              />
            </View>
          )}
          {points?.length!! > 0 && (
            <>
              <GapView length={20} />
              <Points
                data={points}
                success={isSuccess}
                notFound={title == 'Device not found'}
              />
            </>
          )}
          <GapView length={40} />
          <View style={{ alignSelf: 'center' }}>
            <Rounded onPress={onPress} label={btnText!!} />
          </View>
          <GapView length={20} />
          {onSkip && (
            <TouchableOpacity onPress={onSkip}>
              <MyText
                size={18}
                text={'I’ll do it later'}
                textStyle={{ color: colors.primary, textAlign: 'center' }}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animatable.View>
  );
}

const Points = ({
  data,
  success,
  notFound,
}: {
  data?: string[];
  success: boolean;
  notFound: boolean;
}) => {
  return (
    <>
      {data?.map((item: string, index: number) => (
        <View key={index + item}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {success ? <Check /> : notFound ? <Check /> : <CrossC />}
            <GapView length={10} mode="horizontal" />
            <MyText
              text={item}
              size={16}
              textStyle={{ color: '#3e3e3e', fontSize: 16 }}
            />
            <GapView mode="horizontal" length={5} />
            {item == 'Location permission denied' && (
              <TouchableOpacity
                onPress={_requestUserLocationPermission}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MyText
                  text={'Enable'}
                  size={16}
                  textStyle={{ color: '#006870', fontSize: 16 }}
                />
                <OpenLink width={14} height={14} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '85%',
  },
});
