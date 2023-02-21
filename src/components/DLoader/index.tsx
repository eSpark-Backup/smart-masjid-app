import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DeviceLoaderGif } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';

export default function DLoader() {
  return (
    <View style={styles.container}>
      <MyText
        text={`Your Device will be connected soon\nplease wait....`}
        pressable={false}
        textStyle={styles.text}
      />
      <GapView length={30} />
      <Image
        source={DeviceLoaderGif}
        style={styles.loader}
        resizeMode="contain"
      />
      <GapView length={30} />
      <MyText
        text={`Make sure you power on your device and\nturn on bluetooth on your phone.`}
        pressable={false}
        textStyle={styles.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  loader: { height: 250, width: 250, alignSelf: 'center' },
  text: { fontWeight: '400', fontSize: 16, textAlign: 'center' },
});
