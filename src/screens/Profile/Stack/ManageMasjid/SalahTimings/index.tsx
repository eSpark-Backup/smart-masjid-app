import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { SalahTimingsSVG, VolumeUp } from '../../../../../assets';
import {
  GapView,
  ProfileSectionlist,
  TextLabel,
} from '../../../../../components';

export default function SalahSettings({
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
            label="Salah Settings"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>

      <View style={{ top: 100 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({});
