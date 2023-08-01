import React, { useState, useEffect } from 'react';
import { View, BackHandler, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  About,
  AccountGear,
  Help,
  InfoCircle,
  ManageUser,
  MasjidGear,
  Privacy,
  ProfileDummy,
} from '../../assets';
import {
  ErrorModal,
  GapView,
  ProfileAvatar,
  ProfileSectionlist,
  TextLabel,
} from '../../components';
import { Wrapper } from '../../containers';
import {
  AdhanSettings,
  IqamahTimings,
  JummaTimings,
  ManageAccount,
  ManageMasjid,
  ModifyAccount,
  SalahTimings,
  IqamahHistory,
  JummaHistory,
  ManageUsers,
  ViewUser,
  AddUser,
} from './Stack';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { useHookstate } from '@hookstate/core';
import { userStore } from '../../store/UserStore';
import { UserResponse } from '../../types/userControllerApiResponse';

type ProfileNavigationProp = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'Profile'
>;

export default function Profile() {
  const navigation = useNavigation<ProfileNavigationProp['navigation']>();
  const [flag, setFlag] = useState('uInfo');
  const [user, setUser] = useState<UserResponse | null>();

  const handleBack = (currScreen: string) => {
    console.log(currScreen);
    if (currScreen == 'mAcc' || currScreen == 'mMas') {
      setFlag('uInfo');
      return;
    }
    if (currScreen == 'mAccOtp') {
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
    if (currScreen == 'vUser' || currScreen == 'addUser') {
      setFlag('mUsers');
      return;
    }
    if (currScreen == 'uInfo') {
      navigation.navigate('Home');
    } else {
      setFlag('uInfo');
      return;
    }
  };

  const backAction = () => {
    handleBack(flag);
    console.log('current flag', flag);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [flag]);

  const handleSpacing = (currScreen: string) => {
    if (
      currScreen == 'iEdit' ||
      currScreen == 'iHist' ||
      currScreen == 'iTime' ||
      currScreen == 'jTime' ||
      currScreen == 'jEdit' ||
      currScreen == 'jHist' ||
      currScreen == 'mUsers' ||
      currScreen == 'vUser' ||
      currScreen == 'addUser'
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Wrapper
      bgImageSpacer={false}
      showFooter={false}
      onBackPress={() => handleBack(flag)}>
      {({ props }) => {
        return (
          <>
            {flag == 'uInfo' && (
              <UserInformation
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'mAcc' ? (
              <ManageAccount
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            ) : null}
            {flag == 'mAccOtp' ? (
              <ManageAccount
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
                showVerification={true}
              />
            ) : null}
            {flag == 'modAcc' && (
              <ModifyAccount
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'mMas' && (
              <ManageMasjid
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'sTime' && (
              <SalahTimings
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'aSet' && (
              <AdhanSettings
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'iTime' && (
              <IqamahTimings
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'iHist' && (
              <IqamahHistory
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'jTime' && (
              <JummaTimings
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'jHist' && (
              <JummaHistory
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'mUsers' && (
              <ManageUsers
                contentOpacity={props.contentOpacity}
                setFlag={(value: string, user?: UserResponse) => {
                  setFlag(value);
                  user && setUser(user);
                }}
              />
            )}
            {flag == 'vUser' && (
              <ViewUser
                contentOpacity={props.contentOpacity}
                user={user}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
            {flag == 'addUser' && (
              <AddUser
                contentOpacity={props.contentOpacity}
                setFlag={(value: string) => setFlag(value)}
              />
            )}
          </>
        );
      }}
    </Wrapper>
  );
}

function UserInformation({
  setFlag,
  contentOpacity,
}: {
  setFlag: (value: string) => void;
  contentOpacity: any;
}) {
  const userData = useHookstate(userStore.userData).get();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 70, alignItems: 'center' }}>
        <ProfileDummy height={50} width={50} />
        <GapView />
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label={
              (userData?.firstName ?? '') + ' ' + (userData?.lastName ?? '')
            }
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 45 }}>
        <ProfileSectionlist
          data={[
            {
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
                  hidden:
                    userData?.userType.id == 1 ||
                    userData?.userType?.permissions?.filter(
                      val => val?.name == 'MANAGE_MASJID',
                    )?.length == 0,
                },
                {
                  title: 'Manage Users',
                  icon: <ManageUser />,
                  onPress: () => setFlag('mUsers'),
                  hidden:
                    userData?.userType.id == 1 ||
                    userData?.userType?.permissions?.filter(
                      val => val?.name == 'MANAGE_USERS',
                    )?.length == 0,
                },
              ],
            },
          ]}
          footerData={[
            {
              title: 'Help',
              icon: <Help />,
              onPress: () => console.log('pressed'),
            },
          ]}
        />
      </View>
    </View>
  );
}
