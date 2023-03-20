import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, Rounded, TextLabel } from '../../components';
import { Card } from '../../containers';

export default function DeviceNicknameForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Let’s give your device a nick name"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card width={315}>
        <MyInput placeholder="Nick Name" />
      </Card>
      <View style={{ marginTop: 80, marginBottom: 40 }}>
        <Rounded label="Next" width={250} onPress={() => setStep(4)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
