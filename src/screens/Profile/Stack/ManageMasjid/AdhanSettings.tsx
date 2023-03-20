import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  ProfileAvatar,
  TextLabel,
} from '../../../../components';

export default function AdhanSettings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            paddingTop: 30,
            padding: 15,
            paddingBottom: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
      <GapView length={40} />
      <MyText
        text="Contact support@smartmasjid.net to update the adhan settings"
        textStyle={{
          paddingHorizontal: 37.5,
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '400',
          color: '#000000',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
