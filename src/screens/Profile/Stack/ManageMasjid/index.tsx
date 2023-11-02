import React, { useState } from 'react';
import { StyleSheet, View, Animated, ScrollView, Platform } from 'react-native';
import { useHookstate } from '@hookstate/core';

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
  OverlayLoader,
  ProfileSectionlist,
} from '../../../../components';
import { userStore } from '../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../constants';

export default function ManageMasjid({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();
  const masjidInfo = userData?.masjid;

  const [showLoader, setShowLoader] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <OverlayLoader isShow={showLoader} />
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Manage Masjid" />
        </Animated.View>
      </View>

      <ScrollView style={{}}>
        <View style={{ width: '92%', alignSelf: 'center' }}>
          <MyTextHeader style={{ paddingLeft: 5 }} text={masjidInfo?.name!} />
          <View
            style={{
              width: '100%',
              borderTopWidth: 0.25,
              borderColor: '#9E9F9F',
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
                    title: `${
                      masjidInfo?.address1 ? masjidInfo?.address1 + ',' : ''
                    }${masjidInfo?.address2 ? masjidInfo.address2 : ' '} ${
                      masjidInfo?.city ?? ''
                    } ${masjidInfo?.state ?? ''} ${masjidInfo?.zip ?? ''}`,
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
            itemStyle={{
              paddingVertical: 5,
              height: undefined,
            }}
          />
        </View>
        <GapView length={7} />
        <View style={{ width: '92%', alignSelf: 'center' }}>
          <View
            style={{
              width: '100%',
              borderTopWidth: 0.25,
              borderColor: '#9E9F9F',
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
                  hidden: !userData?.userType?.permissions?.some(
                    val => val?.name == 'MANAGE_MASJID_SALAH_TIMINGS',
                  ),
                },
                {
                  title: 'Manage Users',
                  icon: <ManageUser />,
                  onPress: () => setFlag('mUsers'),
                  hidden: !userData?.userType?.permissions?.some(
                    val => val?.name == 'MANAGE_MASJID_USERS',
                  ),
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
