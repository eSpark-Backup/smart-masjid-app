import React from 'react';
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
  LogoutModal,
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';
import ProfileAvatar from '../../components/ProfileAvatar';
type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;
type WelcomeScreenNavigationProp = Props['navigation'];

export default function App() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper bgImageSpacer={false} onBackPress={goBack}>
        <ProfileAvatar />
    </Wrapper>
  );
}
