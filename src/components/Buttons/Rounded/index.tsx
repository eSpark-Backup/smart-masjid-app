import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { GradientColors } from '../../../theme';
import MyText from '../../MyText';

export default function Rounded({
  label,
  width = 250,
  onPress,
}: {
  label: string;
  width?: number | string;
  onPress?: () => void;
}) {
  return (
    <View style={{ width }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <LinearGradient
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
          colors={GradientColors}>
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
      </TouchableWithoutFeedback>
    </View>
  );
}
