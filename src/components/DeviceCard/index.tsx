import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonIcon, DeviceSvg, PlusSvg, ThreeDotSvg } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import { Device } from '../../types/deviceControllerTypes';
import DeviceStatus from '../DeviceStatus';

export default function DeviceCard({
  deviceData,
  activeTab,
  onPress = () => {},
}: {
  deviceData: Device;
  activeTab: string;
  onPress?: () => void;
}) {
  console.log(
    '🚀 ~ file: index.tsx:63 ~ deviceData?.deviceType:',
    deviceData?.deviceType,
  );
  return (
    <View>
      <Card height={161} width={172}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          style={styles.container}>
          <View style={{ width: '100%', paddingHorizontal: 10 }}>
            <GapView mode="horizontal" length={15} />
            <View>
              <TextLabel
                label={deviceData?.name}
                textStyle={{
                  alignItems: 'center',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              />
              <GapView length={25} />
              {deviceData?.deviceType?.modelNumber.includes('SBB') ? (
                <ButtonIcon
                  height={50}
                  width={50}
                  style={{ alignSelf: 'center' }}
                />
              ) : (
                <DeviceSvg
                  height={50}
                  width={50}
                  style={{ alignSelf: 'center' }}
                />
              )}
              <GapView length={25} />
              <View
                style={{
                  alignItems: 'flex-start',
                  bottom: 5,
                }}>
                <DeviceStatus online />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  status: {
    height: 8,
    width: 8,
    borderWidth: 0.7,
    borderRadius: 10,
  },
  activeStatus: {
    height: 8,
    width: 8,
    borderWidth: 0.7,
    borderRadius: 10,
    backgroundColor: '#1DF126',
  },
});
