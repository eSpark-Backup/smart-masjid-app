import React from 'react';
import { View } from 'react-native';

import { GapView, MyText } from '../index';

const DeviceStatus = ({ online = false }: { online?: boolean }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: 2,
      }}>
      <View
        style={{
          top: 0.5,
          height: 10,
          width: 10,
          borderRadius: 100,
          backgroundColor: online ? '#1DF126' : '#FF6464',
        }}
      />
      <GapView length={5} mode="horizontal" />
      <MyText
        text={online ? 'Online' : 'Offline'}
        textStyle={{ color: '#6E6E6E', fontSize: 16 }}
      />
    </View>
  );
};

export default DeviceStatus;
