import React from 'react';
import { Text, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function MyText({
  text,
  size,
  textStyle,
  onPress,
  pressable = false,
}: {
  text: string;
  size?: number;
  textStyle?: TextStyle;
  pressable?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} disabled={!pressable}>
      <Text
        style={{
          fontFamily: 'roboto',
          color: colors.text,
          fontSize: size ?? 14,
          ...textStyle,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
