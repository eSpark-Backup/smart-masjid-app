import React from 'react';
import { Theme, useTheme } from '@react-navigation/native';
import { View, FlatList, Animated } from 'react-native';

import { SyncSvg } from '../../../assets';
import {
  DeviceListItem,
  GapView,
  MyText,
  TextLabel,
} from '../../../components';
import { Card } from '../../../containers';
import { WINDOW_WIDTH } from '../../../constants';

export default function ConnectedDevicesComponent({
  contentOpacity = 0,
}: {
  contentOpacity?: Animated.AnimatedInterpolation<string | number> | number;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MyText text="MY HOME DEVICE " textStyle={{ color: colors.primary }} />
        <SyncSvg />
      </View>
      <GapView length={30} />
      <Card width={WINDOW_WIDTH - 28}>
        <View>
          <FlatList
            data={Array('Home', 'Office', 'Shop', "Gradma's House")}
            renderItem={({ item }) => <DeviceListItem title={item} />}
          />
        </View>
      </Card>
    </View>
  );
}
