import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import MyText from '../MyText';

export default function OutlineDeviceContainer({
  isActive = false,
  isOnline = false,
  name = '',
  onPress = () => {},
}: {
  isActive: boolean;
  isOnline: boolean;
  name: string;
  onPress?: () => void;
}) {
  const { colors }: Theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: isActive ? '#006870D9' : 'transparent',
        borderWidth: 0.8,
        borderColor: colors.primary,
        height: 32,
        width: 130,
        borderRadius: 20,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{ width: 70 }}>
        <MyText
          text={name}
          textStyle={{
            color: isActive ? colors.background : colors.text,
            fontSize: 10,
          }}
          lines={1}
        />
      </View>
      <View
        style={{
          height: 10,
          width: 10,
          backgroundColor: isOnline ? '#17c01e' : '#FF6464',
          borderRadius: 100,
        }}
      />
    </TouchableOpacity>
  );
}
