import React from 'react';
import { View } from 'react-native';
import { AdhanButton, DeviceSvg } from '../../assets';
import { ButtonListing, GapView, TextLabel } from '../../components';

export default function DeviceSelectForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Select your device" />
      <GapView length={50} />
      <ButtonListing
        radius={12}
        data={[
          {
            leftIcon: <DeviceSvg />,
            title: 'Smart Adhan Speaker',
            onPress: () => setStep(3),
          },
          {
            leftIcon: <AdhanButton />,
            title: 'Smart Adhan Button',
            onPress: () => setStep(3),
          },
        ]}
      />
    </View>
  );
}
