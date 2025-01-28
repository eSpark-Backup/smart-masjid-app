import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DeviceSvg } from '../../assets';
import GapView from '../GapView';
import TextLabel from '../TextLabel';
import DeviceStatus from '../DeviceStatus';
import { DStatus } from '../../types';

const DeviceListItem = ({
  title = '',
  subTitle = '',
  disabled = false,
  online = 'Offline',
  onPress = () => {},
}: {
  title: string;
  subTitle?: string;
  disabled?: boolean;
  online?: DStatus;
  onPress?: () => void;
}) => {
  const isDisabled = disabled || online == 'Offline';
  return (
    <>
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          opacity: isDisabled ? 0.5 : 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DeviceSvg height={24} width={24} color={'#9E9F9F'} />
            <GapView length={10} mode="horizontal" />
            <View style={{ alignItems: 'flex-start' }}>
              <TextLabel
                label={title}
                textStyle={{
                  color: '#0E0E0E',
                  // fontWeight: '500',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 16,
                }}
              />
              {subTitle && (
                <TextLabel
                  label={subTitle}
                  lines={1}
                  textStyle={{
                    width: 180,
                    color: '#3E3E3E',
                    // fontWeight: '500',
                    fontFamily: 'Roboto-Medium',
                    fontSize: 14,
                  }}
                />
              )}
            </View>
          </View>
          <DeviceStatus status={online} />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default DeviceListItem;
