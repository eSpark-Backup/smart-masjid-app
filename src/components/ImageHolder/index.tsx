import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

import { MasjidSvg } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';

export default function ImageHolder({
  source,
  text1,
  text2,
}: {
  source?: _SourceUri;
  text1?: string;
  text2?: string;
}) {
  return (
    <View>
      <MyText text={text1!!} textStyle={styles.text} />
      <GapView length={30} />
      {source ? (
        <Image source={source} style={styles.loader} resizeMode="contain" />
      ) : (
        <MasjidSvg style={{ alignSelf: 'center' }} />
      )}
      <GapView length={30} />
      <MyText text={text2!!} textStyle={styles.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    width: 250,
    height: 149.75,
    alignSelf: 'center',
  },
  text: {
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
  },
});
