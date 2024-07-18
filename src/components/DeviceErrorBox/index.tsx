import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import MyText from '../MyText';
import { InfoRed } from '../../assets';
import { Platform } from 'react-native';

export default function DeviceErrorBox({
  show,
  message,
  onClose,
  onIconPress,
  icon,
}: {
  show: boolean;
  message?: string;
  onClose?: () => void;
  onIconPress?: () => void;
  icon?: boolean;
}) {
  if (show) {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <MyText
            text={message!!}
            icon={
              icon == true &&
              message !== 'Device battery low. Please power on your device.' ? (
                <TouchableOpacity onPress={onIconPress}>
                  <InfoRed style={{ bottom: Platform.OS == 'ios' ? -2 : -5 }} />
                </TouchableOpacity>
              ) : undefined
            }
            textStyle={{
              color: '#DC3545',
              fontSize: 14,
              lineHeight: 24,
            }}
          />
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({});
