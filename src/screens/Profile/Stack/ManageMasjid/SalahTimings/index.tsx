import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VolumeUp } from '../../../../../assets';
import { ProfileSectionlist } from '../../../../../components';

export default function SalahSettings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <ProfileSectionlist
        data={[
          {
            title: 'Salah Settings',
            data: [
              {
                title: 'Iqamah Timings',
                icon: <VolumeUp />,
                onPress: () => setFlag('iTime'),
              },
              {
                title: 'Jumma Timings',
                icon: <VolumeUp />,
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
