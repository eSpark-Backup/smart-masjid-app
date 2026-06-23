import React from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';

import {
  IqamaTimingsSvg,
  JummaTimingsSvg,
  MonthlyScheduleSvg,
} from '../../../../../assets';
import {
  GapView,
  MyTitle,
  ProfileSectionlist,
} from '../../../../../components';
import { WINDOW_WIDTH } from '../../../../../constants';

export default function SalahSettings({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Salah Timings" />
        </Animated.View>
      </View>
      <GapView />
      <View>
        <ProfileSectionlist
          data={[
            {
              title: 'Salah Timings',
              data: [
                {
                  title: 'Iqama Timings',
                  icon: (
                    <IqamaTimingsSvg width={25} height={25} color={'#9E9F9F'} />
                  ),
                  onPress: () => setFlag('iTime'),
                },
                {
                  title: 'Jumuah Timings',
                  icon: (
                    <JummaTimingsSvg width={25} height={25} color={'#9E9F9F'} />
                  ),
                  onPress: () => setFlag('jTime'),
                },
                {
                  title: 'Monthly Schedule',
                  icon: (
                    <MonthlyScheduleSvg
                      width={25}
                      height={25}
                      color={'#9E9F9F'}
                    />
                  ),
                  onPress: () => setFlag('HistSett'),
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
