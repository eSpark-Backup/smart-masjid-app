import React from 'react';
import { View, ViewStyle } from 'react-native';
import { WINDOW_WIDTH } from '../../constants';

export default function MyDivider({
  height = 0.8,
  width = WINDOW_WIDTH - 40,
  backgroundColor = '#9E9F9F',
  style = {},
}: {
  height?: number;
  width?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={{
        height: 1,
        width,
        backgroundColor: backgroundColor,
        opacity: .5,
        ...style,
      }}
    />
  );
}
