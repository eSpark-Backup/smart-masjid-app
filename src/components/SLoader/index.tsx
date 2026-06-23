import React from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';

import { SL } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import MyTitle from '../MyTitle';
import MyTextSubHeader from '../MyTextSubHeader';
import { WINDOW_WIDTH } from '../../constants';

export default function SLoader({
  title,
  subtitle,
  message,
  contentOpacity = 0,
}: {
  title?: string;
  subtitle?: string;
  message: string;
  contentOpacity?: any;
}) {
  return (
    <View style={styles.container}>
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
          {title && <MyTitle text={title!} />}
        </Animated.View>
      </View>
      <GapView />
      <View style={{ alignItems: 'center' }}>
        {subtitle && <MyTextSubHeader text={subtitle!!} />}
        <View style={{ alignSelf: 'center' }}>
          <GapView length={15} />
          <MyText
            text="Please wait"
            pressable={false}
            textStyle={{
              //  fontWeight: '400',
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
              color: '#3e3e3e',
            }}
          />
          <GapView length={60} />
          <View>
            <FastImage
              source={SL}
              style={{
                height: 60,
                width: 60,
                alignSelf: 'center',
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View
              style={{
                width: 10,
                height: 2,
                backgroundColor: '#ffffff',
                position: 'absolute',
                bottom: 0,
                left: 15,
              }}
            />
          </View>
          <GapView length={40} />
        </View>
        <GapView length={20} />
        <MyText
          text={message}
          textStyle={{
            // fontWeight: '400',
            fontFamily: 'Roboto-Regular',
            fontSize: 16,
            color: '#3e3e3e',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  loader: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  },
});
