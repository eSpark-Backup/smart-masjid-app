import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { Card } from '../../containers';

export default function EmailForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const { colors }: Theme = useTheme();
  return (
    <View style={styles.container}>
      <TextLabel
        label="Lets create an account"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card width={315}>
        <MyInput placeholder="Email" />
      </Card>
      <View style={{ marginTop: 80, marginBottom: 40 }}>
        <Rounded label="Next" width={250} onPress={() => setStep(2)} />
      </View>
      <GapView length={40} />
      <MyText
        text="Use phone number instead"
        pressable
        textStyle={{ fontSize: 16, fontWeight: '400', color: colors.primary }}
        onPress={() => setStep(1.1)}
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
