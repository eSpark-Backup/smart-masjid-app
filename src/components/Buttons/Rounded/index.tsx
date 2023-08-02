import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@react-navigation/native';

import { GradientColors } from '../../../theme';
import MyText from '../../MyText';

export default function Rounded({
  label,
  width = 250,
  onPress,
  disabled = false,
  outlined = false,
}: {
  label: string;
  width?: number | string;
  onPress?: () => void;
  disabled?: boolean;
  outlined?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ width, height: 41 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ flex: 1 }}>
        <LinearGradient
          style={{
            flex: 1,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: outlined ? 1.5 : 0,
            borderColor: colors.primary,
          }}
          colors={
            !disabled
              ? outlined
                ? [colors.background, colors.background]
                : GradientColors
              : ['#9E9F9F', '#9E9F9F']
          }>
          <MyText
            text={label}
            textStyle={{
              color: outlined ? colors.primary : '#fff',
              fontSize: 18,
              fontWeight: '700',
            }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
