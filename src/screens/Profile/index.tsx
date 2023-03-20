import React, { useState } from 'react';
import { View } from 'react-native';
import { useAtom } from 'jotai';
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
import { ProfileSectionlist } from '../../components';
import { Wrapper } from '../../containers';
import {
  AdhanSettings,
  IqamahTimings,
  JummaTimings,
  ManageAccount,
  ManageMasjid,
  ModifyAccount,
  SalahTimings,
  EditIqamah,
  IqamahHistory,
  EditJumma,
  JummaHistory,
} from './Stack';
import { countAtom, mangaAtom } from '../../store/GlobalStates';
import { BottomNavigationParamList, RootStackParamList } from '../../types';

type ProfileNavigationProp = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'Profile'
>;

export default function Profile() {
  const [count, setCount] = useAtom<any>(mangaAtom);
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
    if (currScreen == 'iEdit' || currScreen == 'iHist') {
      setFlag('iTime');
      return;
    }
    if (currScreen == 'jEdit' || currScreen == 'jHist') {
      setFlag('jTime');
      return;
    }
    if (currScreen == 'uInfo') {
      navigation.navigate('Home');
    } else {
      setFlag('uInfo');
      return;
    }
  };

  const handleSpacing = (currScreen: string) => {
    if (
      currScreen == 'iEdit' ||
      currScreen == 'iHist' ||
      currScreen == 'iTime' ||
      currScreen == 'jTime' ||
      currScreen == 'jEdit' ||
      currScreen == 'jHist'
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Wrapper
      bgImageSpacer={handleSpacing(flag)}
      showFooter={false}
      onBackPress={() => handleBack(flag)}>
      {flag == 'uInfo' && (
        <UserInformation
          getter={count}
          setter={setCount}
          setFlag={(value: string) => setFlag(value)}
        />
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
        <IqamahTimings setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'iHist' && (
        <IqamahHistory setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'jTime' && (
        <JummaTimings setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'jHist' && (
        <JummaHistory setFlag={(value: string) => setFlag(value)} />
      )}
    </Wrapper>
  );
}

function UserInformation({
  setFlag,
  getter,
  setter,
}: {
  setFlag: (value: string) => void;
  getter: any;
  setter: (value: any) => void;
}) {
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
            onPress: () => console.log('pressed', getter),
          },
          {
            title: 'Privacy',
            icon: <Privacy />,
            onPress: () => setter({ ...getter, 'Full Metal Alchemist': 1998 }),
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
