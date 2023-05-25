import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SalahTimingsSVG, VolumeUp } from '../../../../../assets';
import {
  GapView,
  ProfileSectionlist,
  TextLabel,
} from '../../../../../components';

export default function SalahSettings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <GapView length={20} />
      <TextLabel label="Salah Settings" textStyle={{ alignSelf: 'center' }} />
      <GapView length={55} />
      <ProfileSectionlist
        data={[
          {
            title: 'Salah Settings',
            data: [
              {
                title: 'Iqama Timings',
                icon: <SalahTimingsSVG />,
                onPress: () => setFlag('iTime'),
              },
              {
                title: 'Jumuah Timings',
                icon: <SalahTimingsSVG />,
                onPress: () => setFlag('jTime'),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
