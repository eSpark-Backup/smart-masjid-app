import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  About,
  AccountGear,
  Help,
  ManageUser,
  MasjidGear,
  Privacy,
} from '../../assets';
import {
  GapView,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
} from '../../components';
import { Wrapper } from '../../containers';
import {
  AdhanSettings,
  IqamaTimings,
  JummaTimings,
  ManageAccount,
  ManageMasjid,
  ModifyAccount,
  SalahTimings,
} from './Stack';
import { BottomNavigationParamList, RootStackParamList } from '../../types';

type ProfileNavigationProp = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'Profile'
>;

export default function Profile() {
  const navigation = useNavigation<ProfileNavigationProp['navigation']>();

  const [flag, setFlag] = useState('uInfo');

  const handleBack = (currScreen: string) => {
    console.log(currScreen);
    if (currScreen == 'mAcc' || currScreen == 'mMas') {
      setFlag('uInfo');
      return;
    }
    if (currScreen == 'modAcc') {
      setFlag('mAcc');
      return;
    }
    if (currScreen == 'sTime' || currScreen == 'aSet') {
      setFlag('mMas');
      return;
    }
    if (currScreen == 'iTime' || currScreen == 'jTime') {
      setFlag('sTime');
      return;
    }
    if (currScreen == 'uInfo') {
      navigation.navigate('Home');
    } else {
      setFlag('uInfo');
      return;
    }
  };

  return (
    <Wrapper
      // bgImageSpacer={false}
      showFooter={false}
      onBackPress={() => handleBack(flag)}>
      {flag == 'uInfo' && (
        <UserInformation setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'mAcc' && (
        <ManageAccount setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'modAcc' && (
        <ModifyAccount setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'mMas' && (
        <ManageMasjid setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'sTime' && (
        <SalahTimings setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'aSet' && (
        <AdhanSettings setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'iTime' && (
        <IqamaTimings setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'jTime' && (
        <JummaTimings setFlag={(value: string) => setFlag(value)} />
      )}
    </Wrapper>
  );
}

function UserInformation({ setFlag }: { setFlag: (value: string) => void }) {
  return (
    <View style={{ flex: 1 }}>
      <ProfileSectionlist
        data={[
          {
            title: 'User Information',
            data: [
              {
                title: 'Manage Account',
                icon: <AccountGear />,
                onPress: () => {
                  setFlag('mAcc');
                },
              },
              {
                title: 'Manage Masjid',
                icon: <MasjidGear />,
                onPress: () => setFlag('mMas'),
              },
              {
                title: 'Manage Users',
                icon: <ManageUser />,
                onPress: () => console.log('Manage User'),
              },
            ],
          },
        ]}
        footerData={[
          {
            title: 'Help',
            icon: <About />,
            onPress: () => console.log('pressed'),
          },
          {
            title: 'Privacy',
            icon: <Privacy />,
            onPress: () => console.log('pressed'),
          },
          {
            title: 'About us',
            icon: <Help />,
            onPress: () => console.log('pressed'),
          },
        ]}
      />
    </View>
  );
}
