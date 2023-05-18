import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

import { LockSvg, WifiSvg } from '../../assets';
import { ButtonListing, GapView, MyText, TextLabel } from '../../components';
import { WINDOW_HEIGHT } from '../../constants';

export default function WifiSelectForm({
  setStep,
  setSSID,
}: {
  setStep: (value: number) => void;
  setSSID: (value: string) => void;
}) {
  useEffect(() => {
    getWifiList();
  }, []);

  const [data, setData] = useState<any>();
  const rightChild = (
    <>
      <LockSvg />
      <GapView mode="horizontal" />
      <WifiSvg width={24} height={34} />
    </>
  );

  const getWifiList = async () => {
    const res = await WifiManager.loadWifiList();
    console.log('All Wifis', res);
    const newArr = res.map(item => ({
      ...item,
      title: item.SSID,
      rightChild: rightChild,
      onPress: () => {
        console.log('ssid selected', item.SSID);
        setSSID(item.SSID);
        setStep(5);
      },
    }));
    setData(newArr);
  };

  const fakeData = [
    {
      rightChild: (
        <>
          <LockSvg />
          <GapView mode="horizontal" />
          <WifiSvg width={24} height={34} />
        </>
      ),
      title: 'Wifi Network 1',
      onPress: () => setStep(5),
    },
    {
      rightChild: (
        <>
          <LockSvg />
          <GapView mode="horizontal" />
          <WifiSvg width={24} height={34} />
        </>
      ),
      title: 'Wifi Network Shop',
      onPress: () => setStep(5),
    },
    {
      rightChild: (
        <>
          <LockSvg />
          <GapView mode="horizontal" />
          <WifiSvg width={24} height={34} />
        </>
      ),
      title: 'My Wifi',
      onPress: () => setStep(5),
    },
    {
      rightChild: (
        <>
          <LockSvg />
          <GapView mode="horizontal" />
          <WifiSvg width={24} height={34} />
        </>
      ),
      title: 'Shop 5g wifi',
      onPress: () => setStep(5),
    },
  ];

  if (data?.length > 0) {
    return (
      <View style={{ alignItems: 'center' }}>
        <GapView length={20} />
        <TextLabel label="Device Setup" textStyle={{ alignSelf: 'center' }} />
        <GapView length={40} />
        <GapView length={20} />
        <MyText
          textStyle={{ alignItems: 'center', fontSize: 16, fontWeight: '400' }}
          text="Select Wi-Fi network"
        />
        <GapView length={80} />
        <ButtonListing data={data} titleWidth={'50%'} />
      </View>
    );
  } else {
    return (
      <View
        style={{
          height: WINDOW_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <GapView length={20} />
        <TextLabel label="Device Setup" textStyle={{ alignSelf: 'center' }} />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <MyText
            textStyle={{
              fontSize: 18,
              fontWeight: '400',
            }}
            text="No Wifi's Found"
          />
          <GapView length={WINDOW_HEIGHT / 3.5} />
        </View>
      </View>
    );
  }
}
