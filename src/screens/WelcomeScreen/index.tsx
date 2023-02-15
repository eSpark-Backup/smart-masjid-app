import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  DLoader,
  Joined,
  MyInput,
  MyTitle,
  Rounded,
  GapView,
  MyText,
  TextLabel,
  ImageHolder,
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';

import ProfileAvatar from '../../components/ProfileAvatar';

type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;

export default function App() {
  const navigation = useNavigation<WelcomeNavigationProps['navigation']>();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper onBackPress={goBack}>
      {/* <ProfileAvatar /> */}
      <ImageHolder />
    </Wrapper>
  );
}
