import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

import { ButtonIcon, DeviceSvg, StreamerMic } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import TextLabel from '../TextLabel';
import { Device } from '../../types/deviceControllerTypes';
import DeviceStatus from '../DeviceStatus';
import { WINDOW_WIDTH } from '../../constants';
import { DStatus } from '../../types';
import { Image } from 'react-native-animatable';

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
      <Card height={160} width={WINDOW_WIDTH / 2 - 25}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          style={styles.container}>
          <View style={{ width: '100%', flex: 1 }}>
            <GapView mode="horizontal" length={15} />
            <View
              style={{
                flex: 1,
                width: '100%',
                // backgroundColor: 'pink',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextLabel
                label={deviceData?.name}
                // label={'Sint cillum sit amet incididunt officia.'.slice(0, 25)}
                textStyle={{
                  alignItems: 'center',
                  fontSize: 14,
                  textAlign: 'center',
                  // fontWeight: '500',
                  fontFamily: 'Roboto-Medium',
                }}
              />
              {deviceData?.deviceType.id == 3 ? (
                // <Image
                //   source={StreamerMic}
                //   style={{ width: 50, height: 50, tintColor: '#9E9F9F' }}
                // />
                <StreamerMic
                  height={50}
                  width={50}
                  color={'#9E9F9F'}
                  style={{ alignSelf: 'center' }}
                />
              ) : deviceData?.deviceType?.modelNumber.includes('SBB') ? (
                <ButtonIcon
                  height={50}
                  width={50}
                  color={'#9E9F9F'}
                  style={{ alignSelf: 'center' }}
                />
              ) : (
                <DeviceSvg
                  height={50}
                  width={50}
                  color={'#9E9F9F'}
                  style={{ alignSelf: 'center' }}
                />
              )}
              <View
                style={{
                  alignItems: 'center',
                  bottom: 5,
                  right: 2,
                }}>
                <DeviceStatus
                  status={
                    deviceData?.deviceType.id == 3
                      ? deviceData?.deviceTelemetry?.streamer == null
                        ? null
                        : (deviceData?.deviceTelemetry?.streamer as DStatus)
                      : deviceData?.deviceTelemetry?.status
                  }
                />
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 15,
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
