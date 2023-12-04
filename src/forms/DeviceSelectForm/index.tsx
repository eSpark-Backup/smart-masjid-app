import React, { useEffect, useState } from 'react';
import { Animated, View, Platform } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';
import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';

import { AdhanButton, DeviceSvg } from '../../assets';
import {
  ButtonListing,
  GapView,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
} from '../../components';
import { _checkDeviceExists } from '../../api/externalControllers';
import { Device } from '../../types/deviceControllerTypes';
import { WINDOW_WIDTH } from '../../constants';
//@ts-ignore
import { bytesToString } from 'convert-string';
import { UserPermissions } from '../../types/userControllerApiResponse';

export default function DeviceSelectForm({
  data = [],
  userPermissions,
  setStep,
  setDevMacId,
  autoSelect,
  selectedDeviceData,
  contentOpacity,
  fromMasjidDevices,
}: {
  data?: Array<Peripheral | undefined>;
  userPermissions?: UserPermissions[];
  setStep: (value: number) => void;
  setDevMacId?: (value?: string) => void;
  autoSelect?: boolean;
  selectedDeviceData: Device;
  contentOpacity: any;
  fromMasjidDevices: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const getIOSMacAdd = async (devData: Peripheral) => {
    console.log(devData);

    const devBytes = devData.advertising.manufacturerData?.bytes;
    const strData: string = bytesToString(devBytes);
    return strData;
  };

  async function handleDeviceCheck(item: Peripheral) {
    setLoading(true);
    try {
      console.log('try mein aya');
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

  const newArr = data?.map(item => {
    const isBtn = item?.name?.includes('SMBTN');
    console.log('===============>>>>>>>>', userPermissions);
    const isAdmin = userPermissions?.some(
      val => val.name === 'MANAGE_MASJID_DEVICES',
    );
    if (!isAdmin) {
      if (!isBtn) {
        console.log('admin nhi button nhi');
        return {
          ...item,
          leftIcon: <DeviceSvg />,
          title: 'Bilal Smart Speaker',
          onPress: () => {
            console.log('selected macId', item?.id);
            handleDeviceCheck(item as Peripheral);
          },
        };
      } else {
        console.log('admin nhi button hai');
        return { ...item, title: 'null' };
      }
    } else if (!fromMasjidDevices && isBtn) {
      console.log('masjid devices se nhi hai button hai');
      return { ...item, title: 'null' };
    } else {
      console.log('admin hai button hai');
      return {
        ...item,
        leftIcon: isBtn ? <AdhanButton /> : <DeviceSvg />,
        title: isBtn ? 'Smart Masjid Adhan Button' : 'Bilal Smart Speaker',
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
        // const strData = bytesToString(
        //   item.advertising?.manufacturerData?.bytes,
        // );
        // console.log('finalstrData', strData);
        // console.log('match', strData == selectedDeviceData?.macAddress);

        if (
          Platform.OS == 'ios'
            ? item.advertising?.manufacturerData?.bytes == undefined
              ? false
              : bytesToString(item.advertising?.manufacturerData?.bytes) ==
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
          <ButtonListing trademark radius={12} data={finalArr} />
        )}
      </View>
    </View>
  );
}
