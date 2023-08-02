import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';

export default function MyTextSubHeader({
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
      size={16}
      textStyle={{
        ...styles.title,
        color: "#0E0E0E",
        ...style,
      }}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    width: 310,
    fontWeight: '500'
  },
});
