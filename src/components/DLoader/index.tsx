import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { DeviceLoaderGif } from '../../assets';

export default function DLoader() {
  return (
    <Image
      source={DeviceLoaderGif}
      style={styles.loader}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  loader: { height: 300, width: 300, alignSelf: 'center' },
});
