import { useHookstate } from '@hookstate/core';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { GetIqamahHistory } from '../../../../../../api/masjidController';

import {
  GapView,
  MyText,
  TextLabel,
  TimeSheet,
} from '../../../../../../components';
import { masjidStore } from '../../../../../../store/MasjidStore';
import {
  IqamahTime,
  JummahTime,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';

export default function History({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const iqamahHistory: any = useHookstate<IqamahTime[]>(
    masjidStore.iqamahHistory,
  ).get();

  useEffect(() => {
    GetIqamahHistory('1');
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Iqama History"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 0 }}>
        <TimeSheet data={convertResponseToData(iqamahHistory) ?? []} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
