import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList } from 'react-native';

import { DeviceSvg, SyncSvg } from '../../../assets';
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
        <MyText text="Home " />
        <SyncSvg />
      </View>
      <GapView length={60} />
      <TextLabel
        label="Select Device"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card>
        <View
          style={
            {
              // maxHeight: '60%',
            }
          }>
          <FlatList
            data={Array('Home', 'Office', 'Shop', "Gradma's House")}
            renderItem={({ item }) => (
              <>
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <DeviceSvg height={24} width={24} />
                      <GapView length={10} mode="horizontal" />
                      <View style={{ alignItems: 'flex-start' }}>
                        <TextLabel
                          label={item}
                          textStyle={{
                            color: '#3E3E3E',
                            fontWeight: '400',
                            fontSize: 16,
                          }}
                        />
                      </View>
                    </View>
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
                      <MyText text="Online" textStyle={{ color: '#9E9F9F' }} />
                    </View>
                  </View>
                </View>
              </>
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
}
