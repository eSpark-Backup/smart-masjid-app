import React from 'react';
import { View, Image, StyleSheet, Animated, Platform } from 'react-native';

import { DeviceLoaderGif, DevLoaderGif } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import MyTitle from '../MyTitle';
import MyTextSubHeader from '../MyTextSubHeader';
import { WINDOW_WIDTH } from '../../constants';

export default function DLoader({ contentOpacity }: { contentOpacity: any }) {
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
          <MyTitle text={'Device Setup'} />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <MyTextSubHeader
          text={`Searching for your device..`}
          style={{ textAlign: 'center' }}
        />
        <GapView length={30} />
        <View style={{ padding: 5 }}>
          <Image
            source={DevLoaderGif}
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
