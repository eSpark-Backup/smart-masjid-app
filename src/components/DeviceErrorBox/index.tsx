import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import MyText from '../MyText';
import { InfoRed } from '../../assets';

export default function DeviceErrorBox({
  show,
  message,
  onClose,
  onIconPress,
}: {
  show: boolean;
  message?: string;
  onClose?: () => void;
  onIconPress?: () => void;
}) {
  if (show) {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          alignSelf: 'center',
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <MyText
              text={message!!}
              icon={
                message !==
                'Device battery low. Please power on your device.' ? (
                  <TouchableOpacity onPress={onIconPress}>
                    <InfoRed style={{ bottom: -5 }} />
                  </TouchableOpacity>
                ) : undefined
              }
              textStyle={{
                color: '#FF6464',
                fontSize: 14,
                lineHeight: 24,
                width: 310,
              }}
            />
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({});
