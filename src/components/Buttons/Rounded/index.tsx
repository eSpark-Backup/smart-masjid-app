import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { GradientColors } from '../../../theme';
import MyText from '../../MyText';

export default function Rounded({
  label,
  width = 250,
  onPress,
  disabled = false,
}: {
  label: string;
  width?: number | string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={{ width, height: 55 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ flex: 1 }}>
        <LinearGradient
          style={{
            flex: 1,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          colors={!disabled ? GradientColors : ['#9E9F9F', '#9E9F9F']}>
          <MyText
            text={label}
            textStyle={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '700',
            }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
