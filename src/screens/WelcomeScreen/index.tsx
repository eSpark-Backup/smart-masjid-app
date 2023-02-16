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
  ProfileSectionlist,
  MyDivider,
  ImageHolder,
  ProfileAvatar,
  CenterToast,
  ButtonListing,
  SLoader,
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';

import {
  About,
  DeviceSvg,
  Help,
  LockSvg,
  ManageAccount,
  ManageMasjid,
  Privacy,
  SettingIcon,
  WifiSvg,
} from '../../assets';

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
      <MyTitle
        style={{ alignSelf: 'center', textAlign: 'center' }}
        text={`Welcome to\nSmart Adhan`}
      />
      <GapView length={85} />
      <MyText
        size={16}
        textStyle={{ textAlign: 'center' }}
        text="Have you purchased the adhan device ?"
      />
      <GapView length={80} />
      <Joined
        containerStyle={{ alignSelf: 'center' }}
        onPress1={() => navigation.navigate('USetup')}
      />
    </Wrapper>
  );
}
