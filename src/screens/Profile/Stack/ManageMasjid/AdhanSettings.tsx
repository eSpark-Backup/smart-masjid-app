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
      <ProfileAvatar />
      <MyDivider
        style={{ alignSelf: 'center', top: 22 }}
        height={0.5}
        backgroundColor={'#9E9F9F'}
      />
      <ScrollView>
        <View style={{ flex: 1 }}>
          <GapView length={30} />
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
          <GapView length={20} />
          <MyText
            text={`Contact support@smartmasjid.net to\nupdate the adhan settings`}
            textStyle={{ textAlign: 'center', fontSize: 16, paddingVertical: 20 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
