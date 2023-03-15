import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  GapView,
  MyDivider,
  MyDropDown,
  ProfileAvatar,
  Rounded,
  TextLabel,
} from '../../../../components';

export default function AdhanSettings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 40 }}>
        <View style={{ padding: 20 }}>
          <TextLabel label={'Adhan Settings'} />
        </View>
        <MyDropDown
          title="Calculation"
          placeholder="Muslim World League"
          placeholderColor="#CFCFCF"
          items={[
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
          ]}
        />
        <GapView length={20} />
        <MyDropDown
          title="Juristic"
          placeholder="Muslim World League"
          placeholderColor="#CFCFCF"
          items={[
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
          ]}
        />
      </View>
      <View style={{ alignSelf: 'center' }}>
        <Rounded label="Save" onPress={() => console.log('saved')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
