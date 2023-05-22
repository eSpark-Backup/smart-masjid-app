import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

import { Check, CheckSvg, Exclimation } from '../../assets';
import { Rounded } from '../Buttons';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import * as Animatable from 'react-native-animatable';
import GapView from '../GapView';

export default function MyToast({
  heading,
  title,
  message,
  isSuccess = true,
  btnText,
  onPress,
  points,
  center,
}: {
  heading?: string;
  title: string;
  message: string;
  isSuccess: boolean;
  btnText: string;
  onPress?: () => void;
  points?: string[];
  center?: boolean;
}) {
  const startValue = useRef(new Animated.Value(0)).current;
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
              <TextLabel
                label={heading!!}
                textStyle={{ alignSelf: 'center' }}
              />
              <GapView length={40} />
            </>
          )}
          {title && (
            <MyText
              text={title!!}
              textStyle={{
                fontSize: 20,
                fontWeight: '700',
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
            <MyText
              textStyle={{ fontSize: 16, fontWeight: '400' }}
              text={message}
            />
          </View>
          {points && (
            <>
              <GapView length={25} />
              <Points data={points} />
            </>
          )}
          <GapView length={40} />
          <View style={{ alignSelf: 'center' }}>
            <Rounded onPress={onPress} label={btnText!!} />
          </View>
        </View>
      </Animated.View>
    </Animatable.View>
  );
}

const Points = ({ data }: { data: string[] }) => {
  return (
    <>
      {data.map((item: string) => (
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
  },
});
