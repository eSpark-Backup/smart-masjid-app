import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import { CautionDevice, Check, CheckSvg, CrossC } from '../../assets';
import { Rounded } from '../Buttons';
import MyText from '../MyText';
import * as Animatable from 'react-native-animatable';
import GapView from '../GapView';
import MyTitle from '../MyTitle';
import MyTextSubHeader from '../MyTextSubHeader';

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
            <>
              <Animated.View style={[{ opacity: contentOpacity }]}>
                <MyTitle text={heading} />
              </Animated.View>
              <GapView length={50} />
            </>
          )}
          {title && (
            <MyTextSubHeader
              text={title!!}
              style={{
                marginTop: 5,
                textAlign: 'center',
              }}
            />
          )}
          <View
            style={{ alignSelf: 'center', marginTop: 20, marginBottom: 50 }}>
            {isSuccess ? <CheckSvg /> : <CautionDevice />}
          </View>
          <View
            style={
              center ? { alignItems: 'center' } : { alignItems: 'flex-start' }
            }>
            <MyText
              size={16}
              text={message}
              textStyle={{
                color: isSuccess ? '#3E3E3E' : '#000000',
                fontWeight: isSuccess ? '400' : '500',
                fontSize: 16,
              }}
            />
          </View>
          {points?.length!! > 0 && (
            <>
              <GapView length={20} />
              <Points data={points} success={isSuccess} />
            </>
          )}
          <GapView length={40} />
          <View style={{ alignSelf: 'center' }}>
            <Rounded onPress={onPress} label={btnText!!} />
          </View>
          <GapView />
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

const Points = ({ data, success }: { data?: string[]; success: boolean }) => {
  return (
    <>
      {data?.map((item: string) => (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {success ? <Check /> : <CrossC />}
            <GapView length={10} mode="horizontal" />
            <MyText
              text={item}
              size={16}
              textStyle={{ color: '#3e3e3e', fontSize: 16 }}
            />
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
    top: 138,
  },
});
