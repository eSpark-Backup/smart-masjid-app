import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DeviceSvg } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import DeviceStatus from '../DeviceStatus';

const DeviceListItem = ({
  title = '',
  subTitle = '',
  disabled = false,
  online = true,
  onPress = () => {}
}: {
  title: string;
  subTitle?: string;
  disabled?: boolean;
  online?: boolean;
  onPress?: () => void;
}) => {
  const isDisabled = disabled || !online
  return (
    <>
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={.8}
        onPress={onPress}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          opacity: isDisabled ? .5 : 1
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DeviceSvg height={24} width={24} />
            <GapView length={10} mode="horizontal" />
            <View style={{ alignItems: 'flex-start' }}>
              <TextLabel
                label={title}
                textStyle={{
                  color: '#0E0E0E',
                  fontWeight: '400',
                  fontSize: 16,
                }}
              />
              {subTitle && (
                <TextLabel
                  label={subTitle}
                  textStyle={{
                    color: '#3E3E3E',
                    fontWeight: '400',
                    fontSize: 14,
                  }}
                />
              )}
            </View>
          </View>
          <DeviceStatus online={online} />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default DeviceListItem;
