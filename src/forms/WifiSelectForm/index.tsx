import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Animated } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { useTheme } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';

import { LockSvg, WifiSvg } from '../../assets';
import {
  ButtonListing,
  GapView,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  TextLabel,
} from '../../components';
import { WINDOW_HEIGHT } from '../../constants';
import { _requestUserLocationPermission } from '../../utils/functions';

export default function WifiSelectForm({
  setStep,
  setSSID,
  currentWifiSSID,
  autoSelect,
  contentOpacity,
  setIssues,
}: {
  setStep: (value: number) => void;
  setSSID: (value: string) => void;
  currentWifiSSID: string;
  autoSelect: boolean;
  contentOpacity: any;
  setIssues: (val: string) => void;
}) {
  const { colors } = useTheme();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const rightChild = (
    <>
      <LockSvg style={{ color: colors.primary }} />
      <GapView mode="horizontal" />
      <WifiSvg width={34} height={44} style={{ color: colors.primary }} />
    </>
  );

  useEffect(() => {
    checkLocation();
  }, []);

  const checkLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log('granted', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getWifiList();
      } else {
        setIssues('Location permission denied');
        // _requestUserLocationPermission();
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  const getWifiList = async () => {
    try {
      const res = await WifiManager.loadWifiList();
      console.log('All Wifis', res);
      setLoading(false);
      const removeHidden = res.filter(
        item => !item.SSID.includes('(hidden SSID)'),
      );
      const uniqueSsid = Array.from(
        new Set(removeHidden.map(item => item.SSID)),
      ).map(item2 => {
        return removeHidden.find(item3 => item3.SSID === item2);
      });
      const newArr = uniqueSsid.map(item => ({
        ...item,
        title: item?.SSID,
        rightChild: rightChild,
        onPress: () => {
          console.log('ssid selected', item?.SSID);
          setSSID(item?.SSID!!);
          setStep(5);
        },
      }));
      if (autoSelect) {
        newArr.filter(item => {
          if (item.SSID == currentWifiSSID) {
            setSSID(item?.SSID);
            setStep(5);
          }
        });
      } else {
        setData(newArr);
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.log('Cannot get wifiList', error);
    }
  };

  if (data?.length > 0) {
    return (
      <>
        <OverlayLoader noBg={true} isShow={loading} />
        <View style={{ alignItems: 'center' }}>
          <View style={{ alignSelf: 'center', top: 128 }}>
            <Animated.View style={[{ opacity: contentOpacity }]}>
              <MyTitle text={'Device Setup'} style={{ alignSelf: 'center' }} />
            </Animated.View>
            <GapView length={50} />
          </View>
          <View style={{ top: 130 }}>
            <MyTextSubHeader
              style={{
                alignItems: 'center',
                alignSelf: 'center',
              }}
              text="Select Wi-Fi network"
            />
            <GapView length={50} />
            <View style={{ height: '100%' }}>
              <ButtonListing data={data} titleWidth={'60%'} lines={2} />
            </View>
          </View>
        </View>
      </>
    );
  } else {
    return (
      <>
        <OverlayLoader noBg={true} isShow={loading} />
        <View
          style={{
            height: WINDOW_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ alignSelf: 'center', top: 128 }}>
            <Animated.View style={[{ opacity: contentOpacity }]}>
              <MyTitle text={'Device Setup'} style={{ alignSelf: 'center' }} />
            </Animated.View>
            <GapView length={50} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              bottom: 10,
            }}>
            <MyText
              textStyle={{
                fontSize: 14,
                fontWeight: '400',
                top: loading ? 60 : 0,
              }}
              text={loading ? 'Checking Wifi List' : "No Wifi's Found"}
            />
            <GapView length={WINDOW_HEIGHT / 3.5} />
          </View>
        </View>
      </>
    );
  }
}
