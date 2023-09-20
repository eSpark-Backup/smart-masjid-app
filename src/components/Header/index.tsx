import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import AD from 'react-native-vector-icons/AntDesign';
import { WINDOW_HEIGHT } from '../../constants';
import { ArrowLeft } from '../../assets';

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
        top: WINDOW_HEIGHT / 27,
        width: '100%',
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
