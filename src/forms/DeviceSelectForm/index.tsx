import React, { useEffect, useState } from 'react';
import { Animated, View, Platform } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';
import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';

import { AdhanButton, DeviceSvg } from '../../assets';
import {
  ButtonListing,
  GapView,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  TextLabel,
} from '../../components';
import { _checkDeviceExists } from '../../api/externalControllers';
import { Device } from '../../types/deviceControllerTypes';
import { WINDOW_WIDTH } from '../../constants';
//@ts-ignore
import { bytesToString } from 'convert-string';

export default function DeviceSelectForm({
  data = [],
  userInfo,
  setStep,
  setDevMacId,
  autoSelect,
  selectedDeviceData,
  contentOpacity,
}: {
  data?: Array<Peripheral | undefined>;
  userInfo?: string;
  setStep: (value: number) => void;
  setDevMacId?: (value?: string) => void;
  autoSelect?: boolean;
  selectedDeviceData: Device;
  contentOpacity: any;
}) {
  const [loading, setLoading] = useState(false);

  const getIOSMacAdd = async (devData: Peripheral) => {
    const devBytes = devData.advertising.manufacturerData?.bytes;
    const strData: string = bytesToString(devBytes);
    return strData;
  };

  async function handleDeviceCheck(item: Peripheral) {
    setLoading(true);
    try {
      const res = await _checkDeviceExists(
        Platform.OS == 'ios'
          ? ((await getIOSMacAdd(item as Peripheral)) as unknown as string)
          : (item?.id as string),
      );
      console.log('res', Boolean(res), item.id);
      if (!Boolean(res)) {
        setStep(3);
        setDevMacId?.(item.id);
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
      crashlytics().recordError(error as Error);
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
            handleDeviceCheck(item as Peripheral);
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
          handleDeviceCheck(item as Peripheral);
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

  useEffect(() => {
    if (autoSelect) {
      finalArr.filter(item => {
        const strData = bytesToString(
          item.advertising?.manufacturerData?.bytes,
        );
        console.log('finalstrData', strData);
        console.log('match', strData == selectedDeviceData?.macAddress);

        if (
          Platform.OS == 'ios'
            ? bytesToString(item.advertising?.manufacturerData?.bytes) ==
              selectedDeviceData?.macAddress
            : item.id == selectedDeviceData?.macAddress
        ) {
          setStep(3);
          setDevMacId?.(item.id);
        }
      });
    }
  }, [autoSelect]);

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text={'Device Setup'} />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <MyTextSubHeader text="Devices found" style={{ alignSelf: 'center' }} />
        <GapView length={30} />
        {loading ? (
          <OverlayLoader isShow={loading} noBg={true} />
        ) : (
          <ButtonListing radius={12} data={finalArr} />
        )}
      </View>
    </View>
  );
}
