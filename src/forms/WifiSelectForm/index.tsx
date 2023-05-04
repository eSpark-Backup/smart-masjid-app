import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';

import { LockSvg, WifiGreen, WifiSvg } from '../../assets';
import { ButtonListing, GapView, MyText, TextLabel } from '../../components';

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

  if (data) {
    return (
      <View style={{ alignItems: 'center' }}>
        <GapView length={20} />
        <TextLabel
          textStyle={{ alignItems: 'center' }}
          label="Select Wi-Fi network"
        />
        <GapView length={80} />
        <ButtonListing
          data={data}
          titleWidth={'50%'}
          // data={[
          //   {
          //     rightChild: (
          //       <>
          //         <LockSvg />
          //         <GapView mode="horizontal" />
          //         <WifiSvg width={24} height={34} />
          //       </>
          //     ),
          //     title: 'Wifi Network 1',
          //     onPress: () => setStep(5),
          //   },
          //   {
          //     rightChild: (
          //       <>
          //         <LockSvg />
          //         <GapView mode="horizontal" />
          //         <WifiSvg width={24} height={34} />
          //       </>
          //     ),
          //     title: 'Wifi Network Shop',
          //     onPress: () => setStep(5),
          //   },
          //   {
          //     rightChild: (
          //       <>
          //         <LockSvg />
          //         <GapView mode="horizontal" />
          //         <WifiSvg width={24} height={34} />
          //       </>
          //     ),
          //     title: 'My Wifi',
          //     onPress: () => setStep(5),
          //   },
          //   {
          //     rightChild: (
          //       <>
          //         <LockSvg />
          //         <GapView mode="horizontal" />
          //         <WifiSvg width={24} height={34} />
          //       </>
          //     ),
          //     title: 'Shop 5g wifi',
          //     onPress: () => setStep(5),
          //   },
          // ]}
        />
      </View>
    );
  } else {
    return (
      <View style={{ alignItems: 'center' }}>
        <GapView length={20} />
        <TextLabel
          textStyle={{ alignItems: 'center' }}
          label="Select Wi-Fi network"
        />
        <GapView length={80} />
      </View>
    );
  }
}
