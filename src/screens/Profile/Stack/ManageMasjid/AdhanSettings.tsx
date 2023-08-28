import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
import { useHookstate } from '@hookstate/core';

import { GetMasjidAdhanSetting } from '../../../../api/masjidController';
import { GapView, MyText, MyTitle } from '../../../../components';
import { masjidStore } from '../../../../store/MasjidStore';
import { WINDOW_WIDTH } from '../../../../constants';

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
          <MyTitle text="Adhan Settings" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 100 }}>
        <GapView length={15} />
        <View style={styles.settingContainer}>
          <MyText
            textStyle={styles.settingText}
            size={12}
            text={adhanConfig?.adhanCalcConfig?.name ?? ''}
          />
        </View>
        <GapView length={20} />
        <View style={styles.settingContainer}>
          <MyText
            textStyle={styles.settingText}
            size={12}
            text={adhanConfig?.adhanJuristicConfig?.name ?? ''}
          />
        </View>
        <GapView length={30} />
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

const styles = StyleSheet.create({
  settingContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#9E9F9F',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: WINDOW_WIDTH - 28,
    alignSelf: 'center',
  },
  settingText: { color: '#9E9F9F', fontWeight: '400' },
});
