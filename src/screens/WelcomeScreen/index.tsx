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
} from '../../components';
import { Card, Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';

import {
  About,
  Help,
  ManageAccount,
  ManageMasjid,
  Privacy,
  SettingIcon,
} from '../../assets';
type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;

const Data = [
  {
    title: 'User Information',
    icon: <SettingIcon />,
    data: [
      { title: 'Manage Account', icon: <ManageAccount />, onPress: () => {} },
      { title: 'Manage Masjid', icon: <ManageMasjid />, onPress: () => {} },
    ],
  },
];

const FooterArray = [
  { title: 'Help', icon: <Help />, onPress: () => {} },
  { title: 'Privacy', icon: <Privacy />, onPress: () => {} },
  { title: 'About us', icon: <About />, onPress: () => {} },
];

export default function App() {
  const navigation = useNavigation<WelcomeNavigationProps['navigation']>();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper onBackPress={goBack}>
      {/* <CenterToast
        mode={true}
        title="Congratulations"
        message="Your Device is Successfully Connected"
      /> */}
      <MyDivider style={{ alignSelf: 'center' }} />
      <ProfileSectionlist data={Data} footerData={FooterArray} />
    </Wrapper>
  );
}
