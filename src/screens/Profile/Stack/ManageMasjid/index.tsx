import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { VolumeUp } from '../../../../assets';

import {
  GapView,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
} from '../../../../components';

export default function ManageMasjid({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <ProfileSectionlist
        data={[
          {
            title: 'Manage Masjid',
            data: [
              {
                title: 'Adhan settings',
                icon: <VolumeUp />,
                onPress: () => setFlag('aSet'),
              },
              {
                title: 'Salah Timings',
                icon: <VolumeUp />,
                onPress: () => setFlag('sTime'),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
