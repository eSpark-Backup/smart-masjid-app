import React from 'react';
import { View, ScrollView } from 'react-native';
import { LockSvg, WifiGreen, WifiSvg } from '../../assets';
import { ButtonListing, GapView, MyText, TextLabel } from '../../components';

export default function WifiSelectForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={{alignItems: 'center'}}>
      <WifiGreen />
      <GapView length={20} />
      <MyText textStyle={{fontSize: 16, fontWeight: '400'}} text="Choose a wifi network to connect" />
      <GapView length={50} />
      <ButtonListing
        data={[
          {
            rightChild: (
              <>
                <LockSvg />
                <GapView mode="horizontal" />
                <WifiSvg />
              </>
            ),
            title: 'Wifi Network 1',
            onPress: () => setStep(4),
          },
          {
            rightChild: (
              <>
                <LockSvg />
                <GapView mode="horizontal" />
                <WifiSvg />
              </>
            ),
            title: 'Wifi Network Shop',
            onPress: () => setStep(4),
          },
          {
            rightChild: (
              <>
                <LockSvg />
                <GapView mode="horizontal" />
                <WifiSvg />
              </>
            ),
            title: 'My Wifi',
            onPress: () => setStep(4),
          },
          {
            rightChild: (
              <>
                <LockSvg />
                <GapView mode="horizontal" />
                <WifiSvg />
              </>
            ),
            title: 'Shop 5g wifi',
            onPress: () => setStep(4),
          },
        ]}
      />
    </View>
  );
}

