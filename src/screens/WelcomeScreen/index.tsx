import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from './style';
import { Joined } from '../../components';

export default function App() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Joined />
    </View>
  );
}
