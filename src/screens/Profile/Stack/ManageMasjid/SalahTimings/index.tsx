import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import {
  HistoryBox,
  IqamaSvg,
  IqamaTimingsSVG,
  JummaTimingsSVG,
  MonthlyScheduleSVG,
  SalahTimingsSVG,
  SujudSvg,
} from '../../../../../assets';
import {
  GapView,
  MyTitle,
  ProfileSectionlist,
} from '../../../../../components';
import { WINDOW_WIDTH } from '../../../../../constants';
import { GetMonthlySchedule } from '../../../../../api/userController';
import { useHookstate } from '@hookstate/core';
import { masjidStore } from '../../../../../store/MasjidStore';
import { userStore } from '../../../../../store/UserStore';

export default function SalahSettings({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const userData = useHookstate(userStore.userData).get();
  const schedule = useHookstate(userStore.monthlySchedule);

  // useEffect(() => {
  //   getScheduleData();
  // }, []);

  const getScheduleData = async () => {
    const res = await GetMonthlySchedule(userData?.masjid.id!);
    if (res) {
      schedule.set(res);
    } else {
      schedule.set(null);
    }
  };

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
                  icon: <IqamaSvg width={25} height={25} />,
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
                  onPress: () => setFlag('Hist'),
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
