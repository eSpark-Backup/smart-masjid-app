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

export default function ModifyAccount({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TextLabel label={'Modify Account'} />
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <GapView />
        <MyInput
          title="Name"
          placeholder="Mukthar Ahmed"
          placeholderColor="#CFCFCF"
          isDivider
          dividerWidth={1}
        />
        <GapView />
        <MyInput
          title="Email"
          placeholder="muk.ahmed@gmail.com"
          placeholderColor="#CFCFCF"
          isDivider
          dividerWidth={1}
        />
        <GapView />
        <MyInput
          title="Phone Number"
          placeholder="+1 4122142457"
          placeholderColor="#CFCFCF"
          isDivider
          dividerWidth={1}
        />
      </View>
      <View style={{ alignSelf: 'center', marginTop: 30, marginBottom: 10 }}>
        <Rounded label="Update" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
