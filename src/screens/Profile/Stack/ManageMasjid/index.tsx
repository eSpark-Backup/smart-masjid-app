import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

import { SalahTimingsSVG, VolumeUp } from '../../../../assets';

import {
  GapView,
  MyDivider,
  ProfileAvatar,
  ProfileSectionlist,
  TextLabel,
} from '../../../../components';

export default function ManageMasjid({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Manage Masjid"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{top: 100}}>
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
                  icon: <SalahTimingsSVG />,
                  onPress: () => setFlag('sTime'),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
