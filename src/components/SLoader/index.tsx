import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { GLoad } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

export default function SLoader({
  title,
  subtitle,
  message,
}: {
  title?: string;
  subtitle?: string;
  message: string;
}) {
  return (
    <View style={styles.container}>
      <GapView length={20} />
      {title && (
        <TextLabel label={title!!} textStyle={{ alignSelf: 'center' }} />
      )}
      <GapView length={40} />
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
        <Image source={GLoad} style={styles.loader} resizeMode="contain" />
        <GapView length={40} />
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
      <GapView length={20} />
      <MyText text={message} textStyle={{ fontWeight: '400', fontSize: 16 }} />
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
