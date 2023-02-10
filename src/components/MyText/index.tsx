import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function MyText({
  text,
  size,
  textStyle,
}: {
  text: string;
  size?: number;
  textStyle?: TextStyle;
}) {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        ...textStyle,
        fontFamily: 'roboto',
        color: colors.text,
        fontSize: size ?? 14,
      }}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({});
