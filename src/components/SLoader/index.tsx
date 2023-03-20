import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { GLoad } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

export default function SLoader({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <View style={styles.container}>
      {title && <TextLabel label={title!!} />}
      <View style={{ alignSelf: 'center', marginTop: 60, marginBottom: 50 }}>
        <MyText
          text="Please wait"
          pressable={false}
          textStyle={{ fontWeight: '400', fontSize: 16 }}
        />
        <GapView length={50} />
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
