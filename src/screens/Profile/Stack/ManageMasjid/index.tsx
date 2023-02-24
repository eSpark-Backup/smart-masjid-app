import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MasjidVector, VolumeUp } from '../../../../assets';

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
            title: 'Manage Masjid',
            data: [
              {
                title: 'Adhan settings',
                icon: <MasjidVector />,
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
