import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { Card } from '../../containers';

export default function PersonalInfoForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Lets have some details about you"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={56} />
      <Card width={315} radius={12}>
        <MyInput
          placeholder="First Name"
          isDivider
          dividerWidth={0.25}
          dividerColor="rgba(158, 159, 159, 1)"
        />
        <MyInput
          placeholder="Last Name"
        />
      </Card>
      <View style={{ marginTop: 60, marginBottom: 40 }}>
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
