import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { SLoaderGif } from '../../assets';

export default function SLoader() {
  return (
    <Image
      source={SLoaderGif}
      style={styles.loader}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  loader: { height: 60, width: 60, alignSelf: 'center' },
});
