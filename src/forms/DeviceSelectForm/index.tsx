import React from 'react';
import { View } from 'react-native';
import { BluetoothSvg, DeviceSvg, MicSvg } from '../../assets';
import { ButtonListing, GapView, TextLabel } from '../../components';

export default function DeviceSelectForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <BluetoothSvg />
      <GapView length={20} />
      <TextLabel label="Select device" />
      <GapView length={50} />
      <ButtonListing
        data={[
          {
            leftIcon: <DeviceSvg />,
            title: 'Smart Azhan Speaker',
            onPress: () => setStep(3),
          },
          {
            leftIcon: <MicSvg />,
            title: 'Smart Azhan Streamer',
            onPress: () => setStep(3),
          },
        ]}
      />
    </View>
  );
}
