import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
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
  MapBox,
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';

import {
  About,
  DeviceSvg,
  Help,
  LockSvg,
  Privacy,
  SettingIcon,
  WifiSvg,
} from '../../assets';
import { ScrollView } from 'react-native';
type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;

export default function App() {
  const navigation = useNavigation<WelcomeNavigationProps['navigation']>();
  const { colors }: Theme = useTheme();
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper onBackPress={goBack}>
      <ScrollView>
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
          onPress2={() => navigation.navigate('USetup')}
        />
        <GapView length={80} />
        <MyText
          text="Use phone number instead"
          pressable
          textStyle={{
            fontSize: 16,
            fontWeight: '400',
            textAlign: 'center',
            color: colors.primary,
          }}
        />
      </ScrollView>
    </Wrapper>
  );
}
