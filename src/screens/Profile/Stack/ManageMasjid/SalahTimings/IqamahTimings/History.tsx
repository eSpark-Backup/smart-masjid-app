import { useHookstate } from '@hookstate/core';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GetIqamahHistory } from '../../../../../../api/masjidController';

import { GapView, MyText, TextLabel, TimeSheet } from '../../../../../../components';
import { masjidStore } from '../../../../../../store/MasjidStore';
import {
  IqamahTime,
  JummahTime,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';

export default function History({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const iqamahHistory: any = useHookstate<IqamahTime[]>(
    masjidStore.iqamahHistory,
  ).get();

  useEffect(() => {
    GetIqamahHistory('1');
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Iqama History" textStyle={{ alignSelf: 'center' }} />
      <GapView length={45} />
      <TimeSheet data={convertResponseToData(iqamahHistory) ?? []} />
    </View>
  );
}

const styles = StyleSheet.create({});
