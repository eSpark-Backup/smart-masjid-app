import { useHookstate } from '@hookstate/core';
import React from 'react';
import { FlatList, View, Animated } from 'react-native';
import {
  DeviceListItem,
  GapView,
  MyDivider,
  MyText,
  MyTitle,
  TextLabel,
} from '../../../components';
import { Card } from '../../../containers';
import { deviceStore } from '../../../store/DeviceStore';
import { Device } from '../../../types/deviceControllerTypes';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../constants';
import { Masjid } from '../../../types/masjidControllerTypes';

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
  return (
    <View
      style={{
        minHeight: WINDOW_HEIGHT/2
      }}>
      <View style={{ alignSelf: 'center', top: 100 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle
            text="Masjid Search"
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{top: 110}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <MyText textStyle={{fontWeight: '400'}} text='You’re subscribing to:' />
            <MyText textStyle={{fontWeight: '500'}}  text={masjidDetails?.name ?? ''} />
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
              renderItem={({ item }: { item: Device }) => (
                <DeviceListItem
                  onPress={() => onPress?.(item)}
                  title={item.deviceType.name}
                  subTitle={item.masjid ? item.masjid.name : 'No Subscription'}
                  disabled={!!item.masjid}
                  online={Boolean(item.deviceTelemetry)}
                />
              )}
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
