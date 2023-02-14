import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { Joined, MyInput, MyTitle } from '../../components';
import { Card, Wrapper } from '../../containers';
import { Rounded } from '../../components/Buttons';

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
      {/* Login Input */}
      <Card>
        <MyInput isDivider />
        <MyInput />
      </Card>
      <View style={{ marginVertical: 10 }} />
      {/* Phone Input */}
      <Card>
        <MyInput isPhoneCode />
      </Card>
      <View style={{ marginVertical: 10 }} />
      {/* Profile Input */}
      <View style={{ paddingHorizontal: 20 }}>
        <MyInput
          title="Name"
          isDivider
          dividerWidth={0.5}
          dividerColor="#3e3e3e"
        />
      </View>
      <View style={{ marginVertical: 10 }} />
      {/* Search Input */}
      <Card>
        <MyInput searchBar />
      </Card>
    </Wrapper>
  );
}
