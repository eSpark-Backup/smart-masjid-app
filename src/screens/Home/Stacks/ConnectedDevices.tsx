import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList } from 'react-native';
import { ConnectedDevice, DeviceSvg } from '../../../assets';
import {
  GapView,
  MyDivider,
  MyText,
  Rounded,
  TextLabel,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
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
        <FlatList
          data={Array(5).fill('a')}
          renderItem={({}) => (
            <View style={{ paddingHorizontal: 15 }}>
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DeviceSvg height={34} width={34} />
                  <GapView length={10} mode="horizontal" />
                  <View>
                    <TextLabel label="Home" />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          borderWidth: 0.4,
                          backgroundColor: '#1DF126',
                        }}
                      />
                      <GapView length={5} mode="horizontal" />
                      <MyText text="Active" />
                    </View>
                  </View>
                </View>
              </>
              <GapView />
              <MyDivider
                height={0.2}
                width={WINDOW_WIDTH - 90}
                backgroundColor="#9E9F9F"
              />
              <GapView />
            </View>
          )}
        />
        <GapView length={15} />
        <View style={{ alignSelf: 'center' }}>
          <Rounded
            onPress={() => {
              navigation.navigate('Device');
            }}
            label="Manage Devices"
          />
        </View>
        <GapView length={15} />
      </Card>
      {/* <MyText text='asdsaasf' /> */}
    </View>
  );
}
