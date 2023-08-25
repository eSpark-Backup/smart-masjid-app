import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Card } from '../../containers';
import MyText from '../MyText';
import { Close } from '../../assets';

export default function DeviceErrorBox({
  show,
  message,
  onClose,
}: {
  show: boolean;
  message?: string;
  onClose?: () => void;
}) {
  if (show) {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          alignSelf: 'center',
        }}>
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <MyText
              text={message!!}
              textStyle={{
                color: '#FF6464',
                fontSize: 14,
                lineHeight: 24,
                width: 310,
              }}
            />
            {/* <TouchableWithoutFeedback onPress={onClose}>
                <Close />
              </TouchableWithoutFeedback> */}
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({});
