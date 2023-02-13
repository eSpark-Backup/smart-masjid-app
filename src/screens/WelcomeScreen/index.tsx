import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { Joined, MyTitle } from '../../components';
import { Wrapper } from '../../containers';

export default function App() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper onBackPress={goBack}>
      <MyTitle text="Welcome to Smart Adhan" />
    </Wrapper>
  );
}
