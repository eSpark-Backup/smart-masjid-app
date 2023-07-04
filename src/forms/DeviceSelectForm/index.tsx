import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';
import Toast from 'react-native-toast-message';

import { AdhanButton, DeviceSvg } from '../../assets';
import {
  ButtonListing,
  GapView,
  MyText,
  OverlayLoader,
  TextLabel,
} from '../../components';
import { _checkDeviceExists } from '../../api/deviceController';

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
  const [loading, setLoading] = useState(false);

  async function handleDeviceCheck(macId: string) {
    setLoading(true);
    try {
      const res = await _checkDeviceExists(macId);
      console.log('res', Boolean(res));
      if (!Boolean(res)) {
        setStep(3);
        setDevMacId?.(macId);
      } else {
        Toast.show({
          text2: 'Device Already Exists',
          type: 'error',
          autoHide: true,
          visibilityTime: 10000,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log('error thrown', error);
      setLoading(false);
    }
  }

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
            handleDeviceCheck(item?.id!);
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
          handleDeviceCheck(item?.id!);
        },
      };
    }
  });
  console.log('new Array', newArr);

  const finalArr = newArr.filter(item => item.title !== 'null');
  console.log('final Array', finalArr);

  useEffect(() => {
    if (finalArr.length <= 0) {
      setStep(8);
    }
  }, [finalArr]);

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
      {loading ? (
        <OverlayLoader isShow={loading} noBg={true} />
      ) : (
        <ButtonListing radius={12} data={finalArr} />
      )}
    </View>
  );
}
