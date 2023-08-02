import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { Check, CheckSvg, Exclimation } from '../../assets';
import { Rounded } from '../Buttons';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import * as Animatable from 'react-native-animatable';
import GapView from '../GapView';
import MyTitle from '../MyTitle';
import MyTextSubHeader from '../MyTextSubHeader';
import { Theme, useTheme } from '@react-navigation/native';

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
          <GapView length={20} />
          {heading && (
            <>
              <MyTitle text={heading!!} />
              <GapView length={40} />
            </>
          )}
          {title && (
            <MyTextSubHeader
              text={title!!}
              style={{
                textAlign: 'center',
              }}
            />
          )}
          <View
            style={{ alignSelf: 'center', marginTop: 20, marginBottom: 40 }}>
            {isSuccess ? <CheckSvg /> : <Exclimation />}
          </View>
          <View
            style={
              center ? { alignItems: 'center' } : { alignItems: 'flex-start' }
            }>
            <MyText size={16} text={message} />
          </View>
          {points?.length!! > 0 && (
            <>
              <GapView length={25} />
              <Points data={points} />
            </>
          )}
          <GapView length={40} />
          <View style={{ alignSelf: 'center' }}>
            <Rounded onPress={onPress} label={btnText!!} />
          </View>
          <GapView />
          <TouchableOpacity onPress={onSkip}>
            <MyText
              size={18}
              text={'I’ll do it later'}
              textStyle={{ color: colors.primary, textAlign: 'center' }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animatable.View>
  );
}

const Points = ({ data }: { data?: string[] }) => {
  return (
    <>
      {data?.map((item: string) => (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Check height={15} width={15} />
            <GapView length={5} mode="horizontal" />
            <MyText text={item} size={16} textStyle={{ color: '#3e3e3e' }} />
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
    top: 112,
  },
});
