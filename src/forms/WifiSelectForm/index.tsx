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
    <View style={{ alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel
        textStyle={{ alignItems: 'center' }}
        label="Select Wi-Fi network"
      />
      <GapView length={80} />
      <ButtonListing
        data={[
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
        ]}
      />
    </View>
  );
}

