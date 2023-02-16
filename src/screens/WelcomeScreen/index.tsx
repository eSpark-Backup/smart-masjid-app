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

const dataList = [
  {
    rightChild: (
      <View style={{ flexDirection: 'row' }}>
        <LockSvg />
        <GapView mode="horizontal" />
        <WifiSvg />
      </View>
    ),
    title: 'Home Wifi',
  },
  {
    title: 'Smart Azhan Speaker',
    leftIcon: <DeviceSvg />,
  },
  {
    title: 'Smart Azhan Speaker',
    leftIcon: <DeviceSvg />,
  },
];

export default function App() {
  const navigation = useNavigation<WelcomeNavigationProps['navigation']>();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return <Wrapper onBackPress={goBack}>{/* <SLoader /> */}</Wrapper>;
}
