import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  GapView,
  MyDivider,
  MyInput,
  ProfileAvatar,
  Rounded,
  TextLabel,
} from '../../../../components';
import { Card } from '../../../../containers';

export default function ModifyAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <TextLabel label={'Modify Account'} />
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <GapView />
        <Card width={345} radius={12}>
          <MyInput
            placeholder="Mukthar"
            placeholderColor="#CFCFCF"
            isDivider
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
          <MyInput
            placeholder="Ahmed"
            placeholderColor="#CFCFCF"
            isDivider
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
          <MyInput
            placeholder="muk.ahmed@gmail.com"
            placeholderColor="#CFCFCF"
            isDivider
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
          <MyInput
            placeholder="+1 4122142457"
            placeholderColor="#CFCFCF"
            isDivider={false}
            dividerWidth={0.25}
            dividerColor="rgba(158, 159, 159, 1)"
          />
        </Card>
      </View>
      <View style={{ alignSelf: 'center', marginTop: 80, marginBottom: 10 }}>
        <Rounded label="Update" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
