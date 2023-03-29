import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DeviceSvg } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

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
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={.8}
        onPress={onPress}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          opacity: disabled ? .5 : 1
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
                  color: '#3E3E3E',
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
                    fontSize: 16,
                  }}
                />
              )}
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
                backgroundColor: online ? '#1DF126' : '#FF6464',
              }}
            />
            <GapView length={5} mode="horizontal" />
            <MyText text={online ? "Online" : "Offline"} textStyle={{ color: '#9E9F9F' }} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default DeviceListItem;
