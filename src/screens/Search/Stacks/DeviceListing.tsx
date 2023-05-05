import { useHookstate } from '@hookstate/core';
import React from 'react';
import { FlatList, View } from 'react-native';
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

const DeviceListing = ({ onPress }: { onPress?: (device: Device) => void }) => {
  const devices: any = useHookstate(deviceStore.devices).get();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {/* <GapView length={45} />
      <TextLabel label="Masjid Ar - Rahman" textStyle={{ paddingBottom: 5 }} /> */}
      <GapView length={120} />
      <TextLabel
        label="Select Device"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
      />
      <GapView length={60} />
      <Card>
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
            ItemSeparatorComponent={() => (
              <MyDivider
                backgroundColor="#9E9F9F"
                height={0.25}
                style={{
                  paddingHorizontal: 20,
                  alignSelf: 'center',
                  width: '100%',
                }}
              />
            )}
            ListEmptyComponent={() => (
              <View style={{padding: 10, alignItems: 'center'}}>
                <MyText text="You have not setup any device till now" />
              </View>
            )}
          />
        </View>
      </Card>
    </View>
  );
};

export default DeviceListing;
