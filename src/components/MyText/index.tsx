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
  icon,
  trademark,
}: {
  text: string;
  size?: number;
  textStyle?: TextStyle;
  pressable?: boolean;
  onPress?: () => void;
  lines?: number;
  icon?: JSX.Element;
  trademark?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} disabled={!pressable}>
      <Text
        numberOfLines={lines}
        style={{
          // fontWeight: '400',
          fontFamily: 'Roboto-Regular',
          color: '#0E0E0E',
          fontSize: size ?? 14,
          ...textStyle,
        }}>
        {text}
        {trademark && (
          <Text
            style={{
              fontSize: size! + 2 || 16,
            }}>
            &#8482;
          </Text>
        )}
        {icon}
      </Text>
    </TouchableOpacity>
  );
}
