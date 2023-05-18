import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

import { CheckSvg, Exclimation } from '../../assets';
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
}: {
  heading?: string;
  title: string;
  message: JSX.Element;
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
              textStyle={{ fontSize: 20, fontWeight: '700', textAlign: 'center' }}
            />
          )}
          <View
            style={{ alignSelf: 'center', marginTop: 20, marginBottom: 40 }}>
            {isSuccess ? <CheckSvg /> : <Exclimation />}
          </View>
          {/* <GapView length={30} /> */}
          <View>
            {message}
          </View>
          <GapView length={40} />
          <Rounded onPress={onPress} label={btnText!!} />
        </View>
      </Animated.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    // alignItems: 'center',
  },
  loader: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
});
