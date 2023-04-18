import { useHookstate } from '@hookstate/core';
import React from 'react';
import { FlatList, View } from 'react-native';
import {
  DeviceListItem,
  GapView,
  MyDivider,
  TextLabel,
} from '../../../components';
import { Card } from '../../../containers';
import { deviceStore } from '../../../store/DeviceStore';
import { Device } from '../../../types/deviceControllerTypes';

const DeviceListing = ({ onPress }: { onPress?: (device: Device) => void }) => {
  const devices: any = useHookstate(deviceStore.devices).get();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={45} />
      <TextLabel label="Masjid Ar - Rahman" textStyle={{ paddingBottom: 5 }} />
      <GapView length={60} />
      <TextLabel
        label="Select Device"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
      />
      <GapView length={80} />
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
          />
        </View>
      </Card>
    </View>
  );
};

export default DeviceListing;
