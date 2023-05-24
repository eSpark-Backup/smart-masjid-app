import React from 'react';
import { Text, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function MyText({
  text,
  size,
  textStyle,
  onPress,
  pressable = false,
  lines,
}: {
  text: string;
  size?: number;
  textStyle?: TextStyle;
  pressable?: boolean;
  onPress?: () => void;
  lines?: number;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} disabled={!pressable}>
      <Text
        numberOfLines={lines}
        style={{
          fontFamily: 'roboto',
          color: '#0E0E0E',
          fontSize: size ?? 14,
          ...textStyle,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
