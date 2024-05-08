import React, { useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useHookstate } from '@hookstate/core';

import { GetJummahHistory } from '../../../../../../api/masjidController';
import { GapView, TextLabel, TimeSheet } from '../../../../../../components';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { userStore } from '../../../../../../store/UserStore';
import { JummahTime } from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';

export default function History({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();
  const jummahHistory: any = useHookstate<JummahTime[]>(
    masjidStore.JummahHistory,
  ).get();

  useEffect(() => {
    GetJummahHistory(userData?.masjid?.id.toString() as string);
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Jummah History"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 85 }}>
        <TimeSheet data={convertResponseToData(jummahHistory) ?? []} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
