import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VolumeUp } from '../../../../../assets';
import {
  GapView,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
} from '../../../../../components';

export default function SalahSettings({
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
      <GapView length={20} />
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
