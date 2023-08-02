import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';

export default function MyTitle({
  text,
  style = {},
}: {
  text: string;
  style?: TextStyle;
}) {
  const { colors } = useTheme();

  return (
    <MyText
      text={text}
      size={18}
      textStyle={{
        ...styles.title,
        color: "#3E3E3E",
        ...style,
      }}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    width: 310,
    paddingHorizontal: 33,
  },
});
