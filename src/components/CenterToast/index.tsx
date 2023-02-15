import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CheckSvg, CrossSvg } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

export default function CenterToast({
  mode = true,
  title = 'Yay',
  message,
}: {
  mode: boolean;
  title?: string;
  message?: string;
}) {
  return (
    <View style={styles.content}>
      <TextLabel label={title} textStyle={styles.text} />
      <GapView length={20} />
      {mode ? (
        <CheckSvg style={styles.object} />
      ) : (
        <CrossSvg style={styles.object} />
      )}
      <GapView length={50} />
      <MyText
        text={message!!}
        textStyle={{ ...styles.text, ...styles.message }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    padding: 20,
    marginHorizontal: 36,
  },
  object: {
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
  },
  message: {
    fontWeight: '400',
    fontSize: 16,
  },
});
