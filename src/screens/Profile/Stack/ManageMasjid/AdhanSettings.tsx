import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useHookstate } from '@hookstate/core';

import { GetMasjidAdhanSetting } from '../../../../api/masjidController';
import { GapView, MyText, MyTitle } from '../../../../components';
import { masjidStore } from '../../../../store/MasjidStore';
import { WINDOW_WIDTH } from '../../../../constants';
import { userStore } from '../../../../store/UserStore';
import { useTheme } from '@react-navigation/native';
import { AdhanConfig } from '../../../../types/masjidControllerTypes';

export default function AdhanSettings({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const { colors } = useTheme();
  const adhanConfig = useHookstate(masjidStore.adhanConfig).get();
  const userData = useHookstate(userStore.userData).get();
  const [displayData, setDisplayingData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  console.log('adhanCofig', adhanConfig);

  const getAdhanConfig = async () => {
    setLoading(true);
    await GetMasjidAdhanSetting(userData?.masjid?.id.toString() as string)
      .then((adhanConfig: AdhanConfig) =>
        setDisplayingData([
          {
            id: 1,
            title: 'Calculation',
            val: adhanConfig?.adhanCalcConfig?.name,
          },
          {
            id: 2,
            title: 'Juristic',
            val: adhanConfig?.adhanJuristicConfig?.name,
          },
          {
            id: 3,
            title: 'Fajr Angle',
            val: adhanConfig?.fajrAngle,
          },
          {
            id: 4,
            title: 'Maghrib Rule',
            val: adhanConfig?.maghribRule,
          },
          {
            id: 5,
            title: 'Maghrib Value',
            val: adhanConfig?.maghribValue,
          },
          {
            id: 6,
            title: 'Isha Rule',
            val: adhanConfig?.ishaRule,
          },
          {
            id: 7,
            title: 'Isha Value',
            val: adhanConfig?.ishaValue,
          },
        ]),
      )
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
    setLoading(false);
  };

  useEffect(() => {
    getAdhanConfig();
  }, []);
  // useEffect(() => {
  //   if (adhanConfig && displayData.length < 1) {
  //     setDisplayingData([
  //       {
  //         id: 1,
  //         title: 'Calculation',
  //         val: adhanConfig?.adhanCalcConfig?.name,
  //       },
  //       {
  //         id: 2,
  //         title: 'Juristic',
  //         val: adhanConfig?.adhanJuristicConfig?.name,
  //       },
  //       {
  //         id: 3,
  //         title: 'Fajr Angle',
  //         val: adhanConfig?.fajrAngle,
  //       },
  //       {
  //         id: 4,
  //         title: 'Maghrib Rule',
  //         val: adhanConfig?.maghribRule,
  //       },
  //       {
  //         id: 5,
  //         title: 'Maghrib Value',
  //         val: adhanConfig?.maghribValue,
  //       },
  //       {
  //         id: 6,
  //         title: 'Isha Rule',
  //         val: adhanConfig?.ishaRule,
  //       },
  //       {
  //         id: 7,
  //         title: 'Isha Value',
  //         val: adhanConfig?.ishaValue,
  //       },
  //     ]);
  //   }
  // }, [adhanConfig, displayData]);

  const renderAdhanConfig = (item: any) =>
    item?.val ? (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: WINDOW_WIDTH - 30,
          alignSelf: 'center',
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <MyText text={item.title} size={14} textStyle={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <MyText
            text={item.val}
            textStyle={{
              fontSize: 14,
              color: '#6E6E6E',
              textAlign: 'right',
            }}
            lines={1}
          />
        </View>
      </TouchableOpacity>
    ) : null;

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
          <MyTitle text="Adhan Settings" />
        </Animated.View>
      </View>
      <GapView length={10} />
      <View>
        {loading ? (
          <ActivityIndicator size={'large'} color={colors.primary} />
        ) : (
          displayData?.map((item: any, index: number) =>
            renderAdhanConfig(item),
          )
        )}

        {/* <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: WINDOW_WIDTH - 30,
            alignSelf: 'center',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          <MyText
            text={'Adhan Juristic'}
            size={14}
            textStyle={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <MyText
              text={adhanConfig?.adhanJuristicConfig?.name ?? ''}
              textStyle={{
                fontSize: 14,
                color: '#6E6E6E',
                textAlign: 'right',
              }}
              lines={1}
            />
          </View>
        </TouchableOpacity> */}
        {/* <View style={styles.settingContainer}>
          <MyText
            textStyle={styles.settingText}
            size={12}
            text={adhanConfig?.adhanCalcConfig?.name ?? ''}
          />
        </View> */}
        {/* <GapView length={20} />
        <View style={styles.settingContainer}>
          <MyText
            textStyle={styles.settingText}
            size={12}
            text={adhanConfig?.adhanJuristicConfig?.name ?? ''}
          />
        </View> */}
        <GapView length={30} />
        <MyText
          text="Contact support@smartmasjid.app to update the adhan settings"
          textStyle={{
            paddingHorizontal: 37.5,
            textAlign: 'center',
            fontSize: 16,
            // fontWeight: '400',
            fontFamily: 'Roboto-Regular',
            color: '#000000',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#9E9F9F',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: WINDOW_WIDTH - 50,
    alignSelf: 'center',
  },
  settingText: {
    color: '#9E9F9F',
    //  fontWeight: '400',
    fontFamily: 'Roboto-Regular',
  },
});
