import React from 'react';
import { View } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';

import { AdhanButton, DeviceSvg } from '../../assets';
import { ButtonListing, GapView, TextLabel } from '../../components';

export default function DeviceSelectForm({
  data = [],
  setStep,
  setDevMacId,
}: {
  data?: Array<Peripheral | undefined>;
  setStep: (value: number) => void;
  setDevMacId?: (value?: string) => void;
}) {
  const newArr = data.map(item => {
    const isBtn = item?.name?.includes('SMBTN');
    return {
      ...item,
      leftIcon: isBtn ? <AdhanButton /> : <DeviceSvg />,
      title: isBtn ? 'Smart Adhan Button' : 'Smart Adhan Speaker',
      onPress: () => {
        console.log('selected macId', item?.id);
        setStep(3);
        setDevMacId?.(item?.id);
      },
    };
  });

  const fakeDeviceList = [
    { title: 'Smart Adhan Button', leftIcon: <AdhanButton /> },
    { title: 'Smart Adhan Speaker', leftIcon: <DeviceSvg /> },
  ];

  console.log(data, 'xxx');

  return (
    <View style={{ alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Select your device" />
      <GapView length={50} />
      <ButtonListing radius={12} data={newArr} />
    </View>
  );
}
