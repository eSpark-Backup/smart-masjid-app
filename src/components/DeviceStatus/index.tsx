import React from 'react';
import { View } from 'react-native';

import { GapView, MyText } from '../index';
import { DStatus } from '../../types';

const DeviceStatus = ({ status = 'Offline' }: { status?: DStatus }) => {
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
          backgroundColor:
            status == 'Online' || status == 'Online/Running'
              ? '#1DF126'
              : '#FF6464',
        }}
      />
      <GapView length={5} mode="horizontal" />
      <MyText text={status} textStyle={{ color: '#6E6E6E', fontSize: 16 }} />
    </View>
  );
};

export default DeviceStatus;
