import React from 'react';
import { useTheme } from '@react-navigation/native';

import MyText from '../MyText';
import { TextStyle } from 'react-native';

export default function TextLabel({
  label,
  textStyle,
}: {
  label: string;
  textStyle?: TextStyle;
}) {
  const { colors } = useTheme();
  return (
    <MyText
      text={label}
      textStyle={{
        color: colors.text,
        fontWeight: '700',
        fontSize: 18,
        ...textStyle,
      }}
    />
  );
}
