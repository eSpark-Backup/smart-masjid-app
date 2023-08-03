import React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

import { GLoad } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import MyTitle from '../MyTitle';

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
      <View style={{ alignSelf: 'center', top: 128 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          {title && (
            <MyTitle
              text={title!}
              style={{
                alignSelf: 'center',
                fontWeight: '400',
                color: '#3e3e3e',
              }}
            />
          )}
        </Animated.View>
        <GapView length={50} />
      </View>
      <View style={{ top: 120 }}>
        {subtitle && (
          <MyText
            text={subtitle!!}
            textStyle={{ alignSelf: 'center', fontSize: 16, fontWeight: '400' }}
          />
        )}
        <View style={{ alignSelf: 'center' }}>
          <GapView length={15} />
          <MyText
            text="Please wait"
            pressable={false}
            textStyle={{ fontWeight: '400', fontSize: 16 }}
          />
          <GapView length={60} />
          <View>
            <Image source={GLoad} style={styles.loader} resizeMode="contain" />
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
          textStyle={{ fontWeight: '400', fontSize: 16 }}
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
    backgroundColor: '#fff',
  },
});
