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
import { WINDOW_WIDTH } from '../../../constants';
import { Masjid } from '../../../types/masjidControllerTypes';

const DeviceListing = ({
  onPress,
  masjidDetails,
}: {
  onPress?: (device: Device) => void;
  masjidDetails?: Masjid;
}) => {
  const devices: any = useHookstate(deviceStore.devices).get();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label={masjidDetails?.name ?? '-'} />
      <GapView length={60} />
      <MyText
        text="Which device would you like to subscribe?"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center', paddingVertical: 10 }}
      />
      <GapView length={30} />
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
              <View style={{ padding: 10, alignItems: 'center' }}>
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
