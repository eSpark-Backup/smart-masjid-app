import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@react-navigation/native';

import { GradientColors } from '../../../theme';

export default function Joined() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => console.log('heloo')}>
        <LinearGradient colors={GradientColors} style={styles.gradient}>
          <Text style={styles.text}>Yes</Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => console.log('heloo')}>
        <View style={{ ...styles.hollow, borderColor: colors.primary }}>
          <Text style={{ ...styles.text, color: colors.primary }}>No</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    paddingVertical: 17,
    paddingHorizontal: 50,
    fontSize: 18,
    color: '#fff',
  },
  gradient: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  hollow: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
  },
});
