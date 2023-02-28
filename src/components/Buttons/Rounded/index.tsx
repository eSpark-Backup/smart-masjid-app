import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
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
    <View style={{ width }}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
          colors={!disabled ? GradientColors : ['#9E9F9F', '#9E9F9F']}>
          <MyText
            text={label}
            textStyle={{
              color: '#fff',
              paddingVertical: 17,
              paddingHorizontal: 50,
              fontSize: 18,
              fontWeight: '700',
            }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
