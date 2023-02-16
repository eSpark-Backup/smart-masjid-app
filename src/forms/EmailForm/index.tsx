import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../components';
import { Card } from '../../containers';

export default function EmailForm() {
  return (
    <View style={styles.container}>
      <TextLabel
        label="Enter your Email to"
        textStyle={{ alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card width={315}>
        <MyInput />
      </Card>
      <View style={{ marginTop: 80, marginBottom: 40 }}>
        <Rounded label="Next" width={250} />
      </View>
      <MyText
        text="Use phone number instead"
        textStyle={{ fontSize: 16, fontWeight: '400' }}
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
