import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import styles from './style';
import { Wrapper } from '../../components';

export default function App() {
  const { colors } = useTheme();

  return (
    <Wrapper>
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Hello World</Text>
      </View>
    </Wrapper>
  );
}
