import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { Card } from '../../containers';

export default function PhoneForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Enter your Phone number"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card width={315}>
        <MyInput placeholder="Phone Number" isPhoneCode phoneCodeValue="+ 1" />
      </Card>
      <View style={{ marginTop: 80, marginBottom: 40 }}>
        <Rounded label="Next" width={250} onPress={() => setStep(2)} />
      </View>
      <MyText
        text="Use email instead"
        pressable
        textStyle={{ fontSize: 16, fontWeight: '400' }}
        onPress={() => setStep(1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
