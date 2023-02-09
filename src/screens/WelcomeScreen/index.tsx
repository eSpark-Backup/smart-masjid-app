import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from './style';

export default function App() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>Hello World</Text>
    </View>
  );
}
