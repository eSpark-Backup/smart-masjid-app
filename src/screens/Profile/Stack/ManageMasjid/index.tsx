import React, { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { GetMasjid } from '../../../../api/masjidController';

import {
  AdhanSettingSvg,
  Earth,
  Email,
  LocationSvg,
  ManageUser,
  Phone,
  SalahTimingsSVG,
  Web,
} from '../../../../assets';

import {
  GapView,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  ProfileSectionlist,
} from '../../../../components';
import { masjidStore } from '../../../../store/MasjidStore';
import { userStore } from '../../../../store/UserStore';

export default function ManageMasjid({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();
  const masjidInfo = useHookstate(masjidStore.masjid).get();
  useEffect(() => {
    if (!masjidInfo) {
      GetMasjid('1');
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Manage Masjid" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <ScrollView style={{ top: 112, paddingBottom: 112 }}>
        <View style={{ width: '92%', alignSelf: 'center' }}>
          <MyTextHeader
            style={{ paddingLeft: 5 }}
            text="East Plano Islamic Center"
          />
          <View
            style={{
              width: '100%',
              borderTopWidth: 0.5,
              marginVertical: 10,
            }}></View>
          <MyTextSubHeader text="General" />
        </View>
        <GapView />
        <View style={{ flex: 1, height: '50%' }}>
          <ProfileSectionlist
            data={[
              {
                data: [
                  {
                    title: `${masjidInfo?.address1 ?? ''},${
                      masjidInfo?.address2 ? masjidInfo.address2 : ' '
                    } ${masjidInfo?.city ?? ''} ${masjidInfo?.state ?? ''} ${
                      masjidInfo?.zip ?? ''
                    }`,
                    icon: <LocationSvg width={18} height={18} />,
                  },
                  {
                    title: masjidInfo?.website ?? '',
                    icon: <Web width={18} height={18} />,
                  },
                  {
                    title: masjidInfo?.email ?? '',
                    icon: <Email width={18} height={18} />,
                  },
                  {
                    title: masjidInfo?.phone ?? '',
                    icon: <Phone width={18} height={18} />,
                  },
                  {
                    title: masjidInfo?.timezone ?? '',
                    icon: <Earth width={18} height={18} />,
                  },
                ],
              },
            ]}
          />
        </View>
        <GapView length={7} />
        <View style={{ width: '92%', alignSelf: 'center' }}>
          <View
            style={{
              width: '100%',
              borderTopWidth: 0.5,
              marginVertical: 10,
            }}></View>
          <MyTextSubHeader text="Advanced" />
        </View>
        <GapView />
        <ProfileSectionlist
          data={[
            {
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
