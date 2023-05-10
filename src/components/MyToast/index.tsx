import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

import { CheckSvg, Exclimation } from '../../assets';
import { Rounded } from '../Buttons';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import * as Animatable from 'react-native-animatable';
import GapView from '../GapView';

export default function MyToast({
  title,
  message,
  isSuccess = true,
  btnText,
  onPress,
}: {
  title: string;
  message: string;
  isSuccess: boolean;
  btnText: string;
  onPress?: () => void;
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
          {title && (
            <MyText
              text={title!!}
              textStyle={{ fontSize: 16, fontWeight: '400' }}
            />
          )}
          <View
            style={{ alignSelf: 'center', marginTop: 20, marginBottom: 40 }}>
            {isSuccess ? <CheckSvg /> : <Exclimation />}
            <View
              style={{
                width: 10,
                height: 2,
                backgroundColor: '#ffffff',
                position: 'absolute',
                bottom: 0,
                left: 10,
              }}
            />
          </View>
          <GapView length={30} />
          <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
            <MyText
              text={message}
              textStyle={{
                fontWeight: '400',
                fontSize: 16,
                textAlign: 'center',
              }}
            />
          </View>
          <GapView length={70} />
          <Rounded onPress={onPress} label={btnText!!} />
        </View>
      </Animated.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 120,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loader: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
});
