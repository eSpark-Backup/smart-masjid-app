import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@react-navigation/native';

import { GradientColors } from '../../../theme';

interface JoindButtonType {
  title1?: string;
  title2?: string;
  onPress1?: () => void;
  onPress2?: () => void;
  containerStyle?: ViewStyle;
}

export default function Joined({
  title1 = 'Yes',
  title2 = 'No',
  onPress1 = () => console.log('title1'),
  onPress2 = () => console.log('title2'),
  containerStyle = {},
}: JoindButtonType) {
  const { colors } = useTheme();
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <TouchableWithoutFeedback onPress={onPress1}>
        <LinearGradient colors={GradientColors} style={styles.gradient}>
          <Text style={styles.text}>{title1}</Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onPress2}>
        <View style={{ ...styles.hollow, borderColor: colors.primary }}>
          <Text style={{ ...styles.text, color: colors.primary }}>
            {title2}
          </Text>
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
    right: 1
  },
});
