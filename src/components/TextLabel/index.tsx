import React from 'react';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';
import { TextStyle } from 'react-native';

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
        fontWeight: '700',
        fontSize: 18,
        ...textStyle,
      }}
    />
  );
}
