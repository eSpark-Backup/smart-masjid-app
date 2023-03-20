import React, { useState } from 'react';
import { View } from 'react-native';
import { useAtom } from 'jotai';

import { About, AccountGear, Help, MasjidGear, Privacy } from '../../assets';
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
import { countAtom, mangaAtom } from '../../store/GlobalStates';

export default function Profile() {
  const [count, setCount] = useAtom<any>(mangaAtom);
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
    } else {
      setFlag('uInfo');
      return;
    }
  };

  return (
    <Wrapper
      bgImageSpacer={false}
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
        <IqamaTimings setFlag={(value: string) => setFlag(value)} />
      )}
      {flag == 'jTime' && (
        <JummaTimings setFlag={(value: string) => setFlag(value)} />
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
      <ProfileAvatar />
      <MyDivider
        style={{ alignSelf: 'center', top: 22 }}
        height={0.5}
        backgroundColor={'#9E9F9F'}
      />
      <GapView length={20} />
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
