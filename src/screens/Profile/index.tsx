import React, { useState, useEffect } from 'react';
import { View, BackHandler, Animated, Platform } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHookstate } from '@hookstate/core';

import {
  AccountGear,
  Help,
  IqamaTimingsSVG,
  MasjidGear,
  ProfileDummy,
} from '../../assets';
import { GapView, MyTitle, ProfileSectionlist } from '../../components';
import { Wrapper } from '../../containers';
import {
  AdhanSettings,
  IqamahTimings,
  JummaTimings,
  ManageAccount,
  ManageMasjid,
  SalahTimings,
  IqamahHistory,
  ScheduleSettings,
  ManageUsers,
  ViewUser,
  AddUser,
  HelpScreen,
  EditIqamahTimings,
  EditJummaTimings,
  ContactUsScreen,
} from './Stack';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { userStore } from '../../store/UserStore';
import { UserResponse } from '../../types/userControllerApiResponse';
import { IqamahTime, jumuahsData } from '../../types/masjidControllerTypes';
import { GetContactReasons, GetHelpFAQs } from '../../api/helpController';
import { WINDOW_WIDTH } from '../../constants';
import { GetUserTypes } from '../../api/userController';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getCountry } from 'react-native-localize';
import { date } from 'yup';

type ProfileNavigationProp = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'Profile'
>;

interface selectedJummmaData {
  id: number;
  data: jumuahsData[];
  date: string;
}

interface ComponentMap {
  [key: string]: React.ReactNode;
}

interface Titles {
  [key: string]: string;
}

type ScreenActions = {
  [key: string]: () => void; // Define an index signature for the object
};

export default function Profile() {
  const navigation = useNavigation<ProfileNavigationProp['navigation']>();
  const route = useRoute<ProfileNavigationProp['route']>();
  const [flag, setFlag] = useState('uInfo');
  const [jummaData, setJummaData] = useState<object | null>(null);
  const [iqamaData, setIqamaData] = useState<IqamahTime | null>(null);
  const [user, setUser] = useState<UserResponse | null>();
  const [clear, setClear] = useState(false);
  const isFocused = useIsFocused();
  const [currentDate, setCurrentDate] = useState(new Date());

  const titles: Titles = {
    mAcc: 'Manage Account',
    mAccOtp: 'Manage Account',
    modAcc: 'Manage Account',
    mMas: 'Manage Masjid',
    sTime: 'Salah Timings',
    aSet: 'Adhan Settings',
    iTime: 'Iqama Timings',
    iEdit: 'Iqama Timings',
    Hist: 'Monthly Schedule',
    HistSett: 'Monthly Schedule',
    iAdd: 'Iqama Timings',
    jTime: 'Jumuah Timings',
    jEdit: 'Jumuah Timings',
    jAdd: 'Jumuah Timings',
    vUser: 'User Information',
    addUser: 'Add User',
    mUsers: 'Manage Users',
    uInfo: user?.firstName ?? '',
    help: 'Help',
    cUs: 'Contact Us',
  };

  const screenActions: ScreenActions = {
    mAcc: () => setFlag('uInfo'),
    mMas: () => setFlag('uInfo'),
    mAccOtp: () => setFlag('mAcc'),
    sTime: () => setFlag('uInfo'),
    aSet: () => setFlag('mMas'),
    iTime: () => setFlag('sTime'),
    jTime: () => setFlag('sTime'),
    iEdit: () => setFlag('iTime'),
    Hist: () => setFlag('HistSett'),
    HistSett: () => setFlag('sTime'),
    iAdd: () => setFlag('iTime'),
    jEdit: () => setFlag('jTime'),
    jAdd: () => setFlag('jTime'),
    vUser: () => setFlag('mUsers'),
    addUser: () => setFlag('mUsers'),
    mUsers: () => setFlag('mMas'),
    cUs: () => setFlag('help'),
    uInfo: () => navigation.navigate('Home'),
  };

  const getFAQAndReason = async () => {
    await GetContactReasons();
    await GetHelpFAQs();
    await GetUserTypes();
  };

  const handleBack = (currScreen: string) => {
    console.log(currScreen);
    const action = screenActions[currScreen];
    if (action) {
      action();
    } else {
      setFlag('uInfo');
    }
  };

  const backAction = () => {
    handleBack(flag);
    console.log('current flag', flag);
    return true;
  };

  useEffect(() => {
    getFAQAndReason();
  }, []);

  useEffect(() => {
    setFlag('uInfo');
  }, [isFocused]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [flag]);

  const getTitle = () => titles[flag] ?? '';
  console.log('fiag', flag);

  return (
    <Wrapper
      bgImageSpacer={false}
      showFooter={false}
      title={getTitle()}
      onBackPress={() => handleBack(flag)}>
      {({ props }) => {
        const componentMapping: ComponentMap = {
          uInfo: (
            <UserInformation
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          mAcc: (
            <ManageAccount
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          mAccOtp: (
            <ManageAccount
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              showVerification={true}
            />
          ),
          mMas: (
            <ManageMasjid
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          sTime: (
            <SalahTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          aSet: (
            <AdhanSettings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          iTime: (
            <IqamahTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              selectedIqamah={obj => setIqamaData(obj)}
            />
          ),
          Hist: (
            <IqamahHistory
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              masjidId={route?.params?.masjidId}
              currDate={currentDate}
            />
          ),
          HistSett: (
            <ScheduleSettings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              setCurrDate={setCurrentDate}
            />
          ),
          iEdit: (
            <EditIqamahTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              iqamahType={'Edit'}
              selectedIqamah={iqamaData}
            />
          ),
          iAdd: (
            <EditIqamahTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              iqamahType={'Add'}
            />
          ),
          jTime: (
            <JummaTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              selectedJumma={obj => setJummaData(obj)}
            />
          ),
          jEdit: (
            <EditJummaTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              jummaType={'Edit'}
              selectedJumma={jummaData as selectedJummmaData}
            />
          ),
          jAdd: (
            <EditJummaTimings
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
              jummaType={'Add'}
            />
          ),
          mUsers: (
            <ManageUsers
              contentOpacity={props.contentOpacity}
              setFlag={(value: string, user?: UserResponse) => {
                setFlag(value);
                user && setUser(user);
              }}
            />
          ),
          vUser: (
            <ViewUser
              contentOpacity={props.contentOpacity}
              user={user}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          addUser: (
            <AddUser
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          help: (
            <HelpScreen
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
          cUs: (
            <ContactUsScreen
              contentOpacity={props.contentOpacity}
              setFlag={(value: string) => setFlag(value)}
            />
          ),
        };
        return <>{componentMapping[flag]}</>;
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
  console.log(userData?.userType.id);
  console.log('User Data permissions', userData?.userType.permissions);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 2
              : -WINDOW_WIDTH / 1.9 / 1.8,
          alignItems: 'center',
        }}>
        <View
          style={{
            borderRadius: 50,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
          }}>
          <ProfileDummy height={50} width={50} />
        </View>
        <GapView />
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle
            text={
              (userData?.firstName ?? '') + ' ' + (userData?.lastName ?? '')
            }
          />
        </Animated.View>
      </View>
      <GapView />
      <View style={{ flex: 1 }}>
        <ProfileSectionlist
          containerStyle={{ height: '100%' }}
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
                  hidden: !userData?.userType?.permissions?.some(
                    val => val?.name == 'MANAGE_MASJID',
                  ),
                },
                {
                  title: 'Salah Timings',
                  icon: <IqamaTimingsSVG />,
                  onPress: () => setFlag('sTime'),
                  hidden: !userData?.userType?.permissions?.some(
                    val => val?.name == 'MANAGE_MASJID_SALAH_TIMINGS',
                  ),
                },
              ],
            },
          ]}
          footerData={[
            {
              title: 'Help',
              icon: <Help />,
              onPress: () => setFlag('help'),
            },
          ]}
        />
      </View>
    </View>
  );
}
