import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { Card } from '../../containers';

export default function PasswordForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Enter Wi-Fi password"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={20} />
      <MyText text='Connecting to : WiFi Network 1' textStyle={styles.text} />
      <GapView length={60} />
      <Card width={315} radius={12}>
        <MyInput
          placeholder="Password"
        />
      </Card>
      <View style={{ marginTop: 60, marginBottom: 40 }}>
        <Rounded label="Connect" width={250} onPress={() => setStep(6)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 16, fontWeight: '400'}
});
