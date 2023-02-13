import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import AD from 'react-native-vector-icons/AntDesign';
import { WINDOW_HEIGHT } from '../../constants';

export default function Header({ onBackPress }: { onBackPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: WINDOW_HEIGHT / 10,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 25,
      }}>
      <AD
        name="arrowleft"
        color={colors.card}
        size={36}
        onPress={onBackPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
