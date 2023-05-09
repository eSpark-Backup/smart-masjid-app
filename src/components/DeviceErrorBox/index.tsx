import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../containers';
import MyText from '../MyText';
import { Close } from '../../assets';

export default function DeviceErrorBox({
  message,
  onClose,
}: {
  message: string;
  onClose?: () => void;
}) {
  return (
    <Card>
      <View>
        <MyText text={message} />
        <Close onPress={onClose} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({});
