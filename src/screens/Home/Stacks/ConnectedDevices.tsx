import React from 'react';
import { useNavigation } from '@react-navigation/native';
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

export default function ConnectedDevicesComponent() {
  const navigation: any = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {/* <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MyText text="Home " />
        <SyncSvg />
      </View> */}
      <GapView length={110} />
      <TextLabel
        label="Select Device"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
      />
      <GapView length={60} />
      <Card>
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
