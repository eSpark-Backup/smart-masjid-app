import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';

import { AdhanButton, DeviceSvg } from '../../assets';
import { ButtonListing, GapView, MyText, TextLabel } from '../../components';

export default function DeviceSelectForm({
  data = [],
  userInfo,
  setStep,
  setDevMacId,
}: {
  data?: Array<Peripheral | undefined>;
  userInfo?: string;
  setStep: (value: number) => void;
  setDevMacId?: (value?: string) => void;
}) {
  const newArr = data.map(item => {
    const isBtn = item?.name?.includes('SMBTN');
    console.log('===============>>>>>>>>', userInfo);
    const isAdmin = userInfo === 'Masjid Admin';
    if (!isAdmin) {
      if (!isBtn) {
        console.log('admin nhi button nhi');
        return {
          ...item,
          leftIcon: <DeviceSvg />,
          title: 'Smart Adhan Speaker',
          onPress: () => {
            console.log('selected macId', item?.id);
            setStep(3);
            setDevMacId?.(item?.id);
          },
        };
      } else {
        console.log('admin nhi button hai');
        return { ...item, title: 'null' };
      }
    } else {
      console.log('admin hai button hai');
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
    }
  });
  console.log('new Array', newArr);

  const finalArr = newArr.filter(item => item.title !== 'null');
  console.log('final Array', finalArr);

  const fakeDeviceList = [
    { title: 'Smart Adhan Button', leftIcon: <AdhanButton /> },
    { title: 'Smart Adhan Speaker', leftIcon: <DeviceSvg /> },
  ];

  useEffect(() => {
    if (finalArr.length <= 0) {
      setStep(8);
    }
  }, [finalArr]);

  console.log(data, 'xxx');

  return (
    <View style={{ alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Device Setup" />
      <GapView length={40} />
      <MyText
        text="Select Your Device"
        textStyle={{ fontSize: 16, fontWeight: '400', alignSelf: 'center' }}
      />
      <GapView length={80} />
      <ButtonListing radius={12} data={finalArr} />
    </View>
  );
}
