import { useHookstate } from '@hookstate/core';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GetMasjidAdhanSetting } from '../../../../api/masjidController';

import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  ProfileAvatar,
  TextLabel,
} from '../../../../components';
import { masjidStore } from '../../../../store/MasjidStore';

export default function AdhanSettings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const adhanConfig = useHookstate(masjidStore.adhanConfig).get();
  useEffect(() => {
    if(!adhanConfig) {
      GetMasjidAdhanSetting('1')
    }
  }, []);

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
        <GapView length={20} />
        <MyDropDown
          disabled
          title="Calculation"
          placeholder="Muslim World League"
          placeholderColor="#CFCFCF"
          items={[]}
          defaultValue={adhanConfig?.adhanCalcConfig}
        />
        <GapView length={20} />
        <MyDropDown
          disabled
          title="Juristic"
          placeholder="Muslim World League"
          placeholderColor="#CFCFCF"
          items={[]}
          defaultValue={adhanConfig?.adhanJuristicConfig}
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
