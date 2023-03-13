import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList } from 'react-native';

import { ConnectedDevice, DeviceSvg } from '../../../assets';
import {
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
      <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ConnectedDevice />
        <MyText text="Connected Devices " />
      </View>
      <GapView length={30} />
      <Card>
        <GapView length={15} />
        <TextLabel
          label="Connected Device(s)"
          textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
        />
        <GapView length={15} />
        <View
          style={{
            maxHeight: '60%',
          }}>
          <FlatList
            data={Array('Home', 'Office', 'Shop', "Gradma's House")}
            renderItem={({ item }) => (
              <>
                <View
                  style={{
                    paddingHorizontal: 40,
                    paddingVertical: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DeviceSvg height={34} width={34} />
                    <GapView length={10} mode="horizontal" />
                    <View style={{ alignItems: 'flex-start' }}>
                      <TextLabel label={item} />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            top: 0.5,
                            height: 10,
                            width: 10,
                            borderRadius: 100,
                            borderWidth: 2,
                            borderColor: '#9E9F9F',
                            backgroundColor: '#1DF126',
                          }}
                        />
                        <GapView length={5} mode="horizontal" />
                        <MyText text="Active" />
                      </View>
                    </View>
                  </View>
                </View>
                <MyDivider
                  backgroundColor="#9E9F9F"
                  height={0.25}
                  style={{
                    paddingHorizontal: 20,
                    alignSelf: 'center',
                    width: '85%',
                  }}
                />
              </>
            )}
          />
        </View>
        <View>
          <GapView length={20} />
          <View style={{ alignSelf: 'center' }}>
            <Rounded
              onPress={() => {
                navigation.navigate('Device');
              }}
              label="Manage Devices"
            />
          </View>
        </View>
      </Card>
    </View>
  );
}
