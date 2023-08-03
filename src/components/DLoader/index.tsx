import React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { DeviceLoaderGif } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import MyTitle from '../MyTitle';
import MyTextSubHeader from '../MyTextSubHeader';

export default function DLoader({ contentOpacity }: { contentOpacity: any }) {
  return (
    <View style={styles.container}>
      <View style={{ alignSelf: 'center', top: 128 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text={'Device Setup'} />
        </Animated.View>
        <GapView length={50} />
      </View>
      <View style={{ top: 130 }}>
        <MyTextSubHeader
          text={`Searching for your device..`}
          style={{ textAlign: 'center' }}
        />
        <GapView length={30} />
        <View style={{ padding: 5 }}>
          <Image
            source={DeviceLoaderGif}
            style={styles.loader}
            resizeMode="contain"
            resizeMethod="resize"
          />
        </View>
        <GapView length={50} />
        <MyText
          text={`Make sure your device is powered on.`}
          pressable={false}
          textStyle={styles.text}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  loader: {
    height: 250,
    width: 250,
    alignSelf: 'center',
  },
  text: { fontSize: 16, textAlign: 'center' },
});
