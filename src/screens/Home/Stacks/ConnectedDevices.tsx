import React from 'react';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
import { View, FlatList } from 'react-native';

import { DeviceSvg, SyncSvg } from '../../../assets';
import {
  DeviceListItem,
  GapView,
  MyDivider,
  MyText,
  Rounded,
  TextLabel,
} from '../../../components';
import { Card } from '../../../containers';
import { WINDOW_WIDTH } from '../../../constants';

export default function ConnectedDevicesComponent() {
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
      <GapView length={50} />
      <MyText
        text="Select Device"
        size={16}
        textStyle={{ color: '#3E3E3E', alignSelf: 'center', fontWeight: '700' }}
      />
      <GapView length={60} />
      <Card width={WINDOW_WIDTH - 28}>
        <View>
          <FlatList
            data={Array('Home', 'Office', 'Shop', "Gradma's House")}
            renderItem={({ item }) => <DeviceListItem title={item} />}
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
}
