import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ArrowLeft } from '../../assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({
  onBackPress,
  showBack = true,
}: {
  onBackPress?: () => void;
  showBack?: boolean;
}) {
  if (!showBack) return <></>;
  return (
    <View
      style={{
        position: 'absolute',
        top:
          Platform.OS == 'ios'
            ? useSafeAreaInsets().top
            : useSafeAreaInsets().top + 5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        zIndex: 1,
      }}>
      {showBack && (
        <TouchableOpacity style={{ width: 30 }} onPress={onBackPress}>
          <ArrowLeft />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
