import React from 'react';
import { TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';

export default function TextLabel({
  label,
  textStyle,
  lines,
}: {
  label: string;
  textStyle?: TextStyle;
  lines?: number;
}) {
  const { colors } = useTheme();
  return (
    <MyText
      text={label}
      lines={lines}
      textStyle={{
        color: colors.text,
        // fontWeight: '700',
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        ...textStyle,
      }}
    />
  );
}
