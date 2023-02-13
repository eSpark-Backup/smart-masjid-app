import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';

export default function MyTitle({ text }: { text: string }) {
  const { colors } = useTheme();

  return (
    <MyText
      text={text}
      size={24}
      textStyle={{
        ...styles.title,
        color: colors.primary,
      }}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    textAlign: 'center',
    width: 310,
    paddingHorizontal: 33,
  },
});
