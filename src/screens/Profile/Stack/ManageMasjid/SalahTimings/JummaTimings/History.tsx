import { useHookstate } from '@hookstate/core';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GetJummahHistory } from '../../../../../../api/masjidController';

import {
  GapView,
  MyText,
  TextLabel,
  TimeSheet,
} from '../../../../../../components';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { JummahTime } from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';

export default function History({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const jummahHistory: any = useHookstate<JummahTime[]>(
    masjidStore.JummahHistory,
  ).get();

  useEffect(() => {
    GetJummahHistory('1');
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <GapView length={20} />
      <TextLabel label="Jummah History" textStyle={{ alignSelf: 'center' }} />
      <GapView length={55} />
      <TimeSheet data={convertResponseToData(jummahHistory) ?? []} />
    </View>
  );
}

const styles = StyleSheet.create({});
