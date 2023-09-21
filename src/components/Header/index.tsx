import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import AD from 'react-native-vector-icons/AntDesign';
import { WINDOW_HEIGHT } from '../../constants';
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
        top: Platform.OS == 'ios' ? useSafeAreaInsets().top : 10,
        justifyContent: 'center',
        paddingHorizontal: 25,
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
