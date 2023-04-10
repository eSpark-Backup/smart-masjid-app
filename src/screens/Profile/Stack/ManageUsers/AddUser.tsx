import React from 'react';
import { ScrollView, View } from 'react-native';
import { GapView, MyInput, MyText, Rounded, TextLabel } from '../../../../components';
import { Card } from '../../../../containers';

export default function AddUsers({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <ScrollView style={{ flexGrow: 1, marginTop: 90 }}>
      <View
        style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <TextLabel label={'Add New User'} />
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <GapView />
        <Card width={345} radius={12}>
          <MyInput
            placeholder="First Name"
            placeholderColor="#CFCFCF"
            isDivider
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
          <MyInput
            placeholder="Last Name"
            placeholderColor="#CFCFCF"
            isDivider
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
          <MyInput
            placeholder="Email"
            placeholderColor="#CFCFCF"
            isDivider
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
          <MyInput
            placeholder="Phone Number"
            placeholderColor="#CFCFCF"
            isDivider={false}
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
        </Card>
      </View>
      <View style={{ alignSelf: 'center', marginTop: 80, marginBottom: 10 }}>
        <Rounded label="Save" />
      </View>
    </ScrollView>
  );
}
