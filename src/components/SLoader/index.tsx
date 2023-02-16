import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Some } from '../../assets';

export default function SLoader() {
  return (
    <View style={{ alignSelf: 'center' }}>
      <Image source={Some} style={styles.loader} resizeMode="contain" />
      <View
        style={{
          width: 10,
          height: 2,
          backgroundColor: '#ffffff',
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
});
