import { useHookstate } from '@hookstate/core';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
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
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const adhanConfig = useHookstate(masjidStore.adhanConfig).get();
  useEffect(() => {
    if (!adhanConfig) {
      GetMasjidAdhanSetting('1');
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Adhan Settings"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{top: 100}}>
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
    </View>
  );
}

const styles = StyleSheet.create({});
