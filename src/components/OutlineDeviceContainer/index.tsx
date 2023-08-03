import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MyText from '../MyText';

export default function OutlineDeviceContainer({
  isActive = false,
  isOnline = false,
  name = '',
}: {
  isActive: boolean;
  isOnline: boolean;
  name: string;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: isActive ? colors.primary : 'transparent',
        borderWidth: 0.8,
        borderColor: colors.primary,
        height: 32,
        width: 110,
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
          backgroundColor: isOnline ? '#1DF126' : '#FF6464',
          borderRadius: 100,
        }}
      />
    </View>
  );
}
