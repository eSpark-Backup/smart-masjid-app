import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, ScrollView, Platform } from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import { parsePhoneNumber } from 'libphonenumber-js';

import {
  AdhanSettingSvg,
  Earth,
  Email,
  LocationSvg,
  ManageUser,
  Phone,
  Web,
} from '../../../../assets';
import {
  GapView,
  MyTextHeader,
  MyTextSubHeader,
  MyTitle,
  ProfileSectionlist,
} from '../../../../components';
import { userStore } from '../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../constants';
import { GetMasjid } from '../../../../api/masjidController';
import { masjidStore } from '../../../../store/MasjidStore';
import { GlobalProps } from '../../../../types';
import { globalStore } from '../../../../store/GlobalStates';

export default function ManageMasjid({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();
  const masjidInfo = useHookstate(masjidStore.masjid).get();

  useEffect(() => {
    getMasjidInfo();
  }, []);

  const getMasjidInfo = async () => {
    try {
      state.globalLoading.set(true);
      await GetMasjid(userData?.masjid?.id.toString() as string);
      state.globalLoading.set(false);
    } catch (error) {}
  };

  return (
    <View style={{ flex: 1 }}>
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
                    hidden:
                      !masjidInfo?.address1 &&
                      !masjidInfo?.address2 &&
                      !masjidInfo?.city &&
                      !masjidInfo?.state &&
                      !masjidInfo?.zip,
                  },
                  {
                    title: masjidInfo?.website ?? '',
                    icon: <Web width={18} height={18} />,
                    hidden: !masjidInfo?.website,
                  },
                  {
                    title: masjidInfo?.email ?? '',
                    icon: <Email width={18} height={18} />,
                    hidden: !masjidInfo?.email,
                  },
                  {
                    title: masjidInfo?.phone
                      ? parsePhoneNumber(
                          masjidInfo?.phone,
                        ).formatInternational()
                      : '',
                    icon: <Phone width={18} height={18} />,
                    hidden: !masjidInfo?.phone,
                  },
                  {
                    title: masjidInfo?.timezone ?? '',
                    icon: <Earth width={18} height={18} />,
                    hidden: !masjidInfo?.timezone,
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
                  title: 'Adhan Settings',
                  icon: <AdhanSettingSvg width={25} height={25} />,
                  onPress: () => setFlag('aSet'),
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
