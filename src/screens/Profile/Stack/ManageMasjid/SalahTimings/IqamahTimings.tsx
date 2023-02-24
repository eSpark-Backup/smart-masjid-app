import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GapView, MyDivider, ProfileAvatar } from '../../../../../components';

export default function IqamahTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <ProfileAvatar />
      <MyDivider
        style={{ alignSelf: 'center', top: 22 }}
        height={0.5}
        backgroundColor={'#9E9F9F'}
      />
      <GapView length={20} />
    </View>
  );
}

const styles = StyleSheet.create({});
