import React, { useEffect } from 'react';
import { FlatList, View, Animated, Platform } from 'react-native';
import { useHookstate } from '@hookstate/core';

import { DeviceListItem, GapView, MyText, MyTitle } from '../../../components';
import { Card } from '../../../containers';
import { deviceStore } from '../../../store/DeviceStore';
import { Device } from '../../../types/deviceControllerTypes';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../constants';
import { Masjid } from '../../../types/masjidControllerTypes';
import { GetUserDevices } from '../../../api/deviceController';
import { userStore } from '../../../store/UserStore';

const DeviceListing = ({
  onPress,
  masjidDetails,
  contentOpacity = 0,
}: {
  onPress?: (device: Device) => void;
  masjidDetails?: Masjid;
  contentOpacity?: any;
}) => {
  const devices: any = useHookstate(deviceStore.devices).get();
  const userData = useHookstate(userStore.userData).get();

  useEffect(() => {
    GetUserDevices(userData?.id?.toString() ?? '');
  }, []);

  console.log('devices', devices);

  return (
    <View
      style={{
        minHeight: WINDOW_HEIGHT / 2,
      }}>
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
          <MyTitle text="Masjid Search" />
        </Animated.View>
      </View>

      <View style={{ paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MyText
            textStyle={{
              // fontWeight: '400',
              fontFamily: 'Roboto-Regular',
            }}
            text="You’re subscribing to: "
          />
          <MyText
            textStyle={{
              // fontWeight: '400',
              fontFamily: 'Roboto-Medium',
              color: '#3e3e3e',
            }}
            text={masjidDetails?.name ?? ''}
          />
        </View>
        <GapView length={15} />
        <MyText
          text="Available devices"
          textStyle={{
            color: '#3E3E3E',
            alignSelf: 'center',
          }}
        />
        <GapView length={15} />
        <Card width={WINDOW_WIDTH - 28}>
          <View>
            <FlatList
              data={devices}
              renderItem={({ item }: { item: Device }) => {
                console.log('obj', item);
                return (
                  <DeviceListItem
                    onPress={() => onPress?.(item)}
                    title={item.name}
                    subTitle={
                      item.masjid ? item.masjid.name : 'No Subscription'
                    }
                    disabled={!!item.masjid}
                    online={
                      item?.deviceTelemetry?.status == 'Online' ? true : false
                    }
                  />
                );
              }}
              ListEmptyComponent={() => (
                <View style={{ padding: 10, alignItems: 'center' }}>
                  <MyText text="You have not setup any device till now" />
                </View>
              )}
            />
          </View>
        </Card>
      </View>
    </View>
  );
};

export default DeviceListing;
