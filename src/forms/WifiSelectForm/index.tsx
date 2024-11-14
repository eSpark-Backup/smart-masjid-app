import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Animated, Platform } from 'react-native';
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
} from '../../components';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import { _requestUserLocationPermission } from '../../utils/functions';
import { PERMISSIONS, checkMultiple } from 'react-native-permissions';
import { globalStore } from '../../store/GlobalStates';
import { State, useHookstate } from '@hookstate/core';
import { GlobalProps } from '../../types';

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
  const state: State<GlobalProps> = useHookstate(globalStore);
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
    if (Platform.OS == 'android') {
      state.globalLoading.set(true);
    }
    checkLocation();
  }, []);

  const checkLocation = async () => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log('granted', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getWifiList();
        } else {
          state.globalLoading.set(false);
          // _requestUserLocationPermission();
          setIssues('Location permission denied');
        }
      } else {
        checkMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]).then(async statuses => {
          console.log(statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
          if (
            statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'granted' ||
            statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'granted'
          ) {
            const ssid = await WifiManager.getCurrentWifiSSID();
            // const frequency = await WifiManager.getFrequency();
            console.log('ios ke ssid bta', ssid);
            // console.log('ios ke ssid ki frequency bta', frequency);
            // if (frequency >= 5000) {
            //   setIssues(
            //     'It looks like you are connected to a 5Ghz network (SSID name). Please connect to 2.4Ghz network temporarily to setup your device',
            //   );
            //   return;
            // }
            if (currentWifiSSID == ssid && autoSelect) {
              setSSID(ssid);
              setStep(5);
            } else if (!autoSelect) {
              setSSID(ssid);
              setStep(5);
            } else {
              setIssues('Wifi SSID not found');
            }
          } else {
            // _requestUserLocationPermission();
            setIssues('Location permission denied');
          }
        });
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
      state.globalLoading.set(false);
      // setLoading(false);
      const remove5G = res.filter(item => item?.frequency < 5000);
      const removeHidden = remove5G.filter(
        item => !item.SSID.includes('(hidden SSID)'),
      );
      const uniqueSsid = Array.from(
        new Set(removeHidden?.map(item => item.SSID)),
      )?.map(item2 => {
        return removeHidden.find(item3 => item3.SSID === item2);
      });
      const newArr = uniqueSsid?.map(item => ({
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
        console.log('kias', autoSelect, currentWifiSSID);
        newArr.filter(item => {
          if (currentWifiSSID === item?.SSID) {
            console.log('yahan aya??', item.SSID);
            setSSID(item?.SSID);
            setStep(5);
          } else {
            setIssues('Wifi SSID not found');
          }
        });
      } else {
        setData(newArr);
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      state.globalLoading.set(false);
      console.log('Cannot get wifiList', error);
    }
  };

  if (Platform.OS == 'android') {
    if (data?.length > 0) {
      return (
        <>
          {/* <OverlayLoader noBg={true} isShow={loading} /> */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                top: -WINDOW_WIDTH / 1.9 / 3,
              }}>
              <Animated.View style={[{ opacity: contentOpacity }]}>
                <MyTitle
                  text={'Device Setup'}
                  style={{ alignSelf: 'center' }}
                />
              </Animated.View>
            </View>
            <GapView />
            <View>
              <MyTextSubHeader
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                text="Select Wi-Fi network"
              />
              <GapView length={30} />
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
          {/* <OverlayLoader noBg={true} isShow={loading} /> */}
          <View
            style={{
              height: WINDOW_HEIGHT,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                top: -WINDOW_WIDTH / 1.9 / 3,
              }}>
              <Animated.View style={[{ opacity: contentOpacity }]}>
                <MyTitle
                  text={'Device Setup'}
                  style={{ alignSelf: 'center' }}
                />
              </Animated.View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                bottom: 60,
              }}>
              <MyText
                textStyle={{
                  fontSize: 14,
                  // fontWeight: '400',
                  fontFamily: 'Roboto-Regular',
                  top: 0,
                }}
                text={
                  state.globalLoading.get()
                    ? 'Checking Wifi List'
                    : "No Wifi's Found"
                }
              />
              <GapView length={WINDOW_HEIGHT / 3.5} />
            </View>
          </View>
        </>
      );
    }
  } else {
    return <View />;
  }
}
