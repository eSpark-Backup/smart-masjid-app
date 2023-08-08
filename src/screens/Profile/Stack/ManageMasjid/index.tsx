import { useHookstate } from '@hookstate/core';
import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

import {
  AdhanSettingSvg,
  ManageUser,
  SalahTimingsSVG,
  VolumeUp,
} from '../../../../assets';

import {
  GapView,
  MyDivider,
  MyTitle,
  ProfileAvatar,
  ProfileSectionlist,
  TextLabel,
} from '../../../../components';
import { userStore } from '../../../../store/UserStore';

export default function ManageMasjid({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Manage Masjid" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 100 }}>
        <ProfileSectionlist
          data={[
            {
              title: 'Manage Masjid',
              data: [
                {
                  title: 'Adhan settings',
                  icon: <AdhanSettingSvg width={25} height={25} />,
                  onPress: () => setFlag('aSet'),
                },
                {
                  title: 'Salah Timings',
                  icon: <SalahTimingsSVG />,
                  onPress: () => setFlag('sTime'),
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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
