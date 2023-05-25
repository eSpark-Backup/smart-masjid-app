import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DeviceLoaderGif } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

export default function DLoader() {
  return (
    <View style={styles.container}>
      <GapView length={20} />
      <TextLabel label="Device Setup" textStyle={{ alignSelf: 'center' }} />
      <GapView length={40} />
      <MyText
        text={`Searching for your device\nplease wait....`}
        pressable={false}
        textStyle={styles.text}
      />
      <GapView length={30} />
      <Image
        source={DeviceLoaderGif}
        style={styles.loader}
        resizeMode="contain"
      />
      <GapView length={50} />
      <MyText
        text={`Make sure your device is ON.`}
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
