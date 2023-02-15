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
<<<<<<< HEAD
  LogoutModal,
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';
import ProfileAvatar from '../../components/ProfileAvatar';
type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;
type WelcomeScreenNavigationProp = Props['navigation'];
=======
  TextLabel,
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';

type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;
>>>>>>> 718b34f (done)

export default function App() {
  const navigation = useNavigation<WelcomeNavigationProps['navigation']>();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
<<<<<<< HEAD
    <Wrapper bgImageSpacer={false} onBackPress={goBack}>
        <ProfileAvatar />
=======
    <Wrapper onBackPress={goBack}>
      <View>
        <TextLabel label="Email" />
      </View>
>>>>>>> 718b34f (done)
    </Wrapper>
  );
}
