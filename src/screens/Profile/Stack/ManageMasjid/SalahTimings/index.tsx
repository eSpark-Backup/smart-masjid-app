import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import {
  HistoryBox,
  IqamaTimingsSVG,
  JummaTimingsSVG,
  MonthlyScheduleSVG,
  SalahTimingsSVG,
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
                  icon: <IqamaTimingsSVG />,
                  onPress: () => setFlag('iTime'),
                },
                {
                  title: 'Jumuah Timings',
                  icon: <JummaTimingsSVG />,
                  onPress: () => setFlag('jTime'),
                },
                {
                  title: 'Monthly Schedule',
                  icon: <MonthlyScheduleSVG />,
                  onPress: () => setFlag('iHist'),
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
