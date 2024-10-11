import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  GetJummahHistory,
  generatePDf,
} from '../../../../../../api/masjidController';
import {
  GapView,
  LogoutModal,
  MyModal,
  MyText,
  MyTitle,
  Rounded,
  TextLabel,
  TimeSheet,
} from '../../../../../../components';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { userStore } from '../../../../../../store/UserStore';
import { JummahTime } from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';
import { WINDOW_WIDTH } from '../../../../../../constants';
import {
  PublishMonthlySchedule,
  UpdatePublishedMonthlySchedule,
} from '../../../../../../api/userController';
import { GlobalProps } from '../../../../../../types';
import { globalStore } from '../../../../../../store/GlobalStates';
import { OpenLink } from '../../../../../../assets';

export default function ScheduleSettings({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();
  const schedule = useHookstate(userStore.monthlySchedule);
  const monthlySchedule = useHookstate(userStore.monthlySchedule).get();

  const [emailPrompt, setEmailPrompt] = useState(false);
  const [successPrompt, setSuccessPrompt] = useState(false);
  const [displayData, setdisplayData] = useState<any>(null);

  useEffect(() => {
    if (monthlySchedule && !displayData) {
      console.log('monthlySchedule');

      setdisplayData([
        {
          id: 0,
          title: 'Month',
          val:
            moment()
              .month(monthlySchedule?.month! - 1)
              .format('MMMM') ?? 'March',
        },
        {
          id: 1,
          title: 'Year',
          val: monthlySchedule?.year ?? '2023',
        },
        // {
        //   id: 2,
        //   title: 'Is Published',
        //   val: 'Yes',
        // },
        {
          id: 3,
          title: 'PDF',
          val: monthlySchedule?.url
            ? monthlySchedule?.year
              ? moment()
                  .month(monthlySchedule?.month! - 1)
                  .format('MMMM') +
                ' ' +
                monthlySchedule?.year
              : 'March 2024'
            : 'Not found',
        },
        {
          id: 4,
          title: 'Published Date',
          val: moment(monthlySchedule?.createdDate).format('DD/MM/YYYY'),
        },
        {
          id: 5,
          title: 'Updated Date',
          val: monthlySchedule?.updatedDate
            ? moment(monthlySchedule?.updatedDate).format('DD/MM/YYYY')
            : '-',
        },
      ]);
    }
  }, [monthlySchedule]);

  const onPublishSchedule = async () => {
    state.globalLoading.set(true);
    const res = await PublishMonthlySchedule(userData?.masjid?.id!);
    if (res) {
      schedule.set(res);
      state.globalLoading.set(false);
    } else {
      state.globalLoading.set(false);
    }
  };
  const onUpdatePublishedSchedule = async () => {
    state.globalLoading.set(true);
    const res = await UpdatePublishedMonthlySchedule(
      userData?.masjid?.id!,
      monthlySchedule?.id!,
    );
    if (res) {
      schedule.set(res);
      state.globalLoading.set(false);
    } else {
      state.globalLoading.set(false);
    }
  };

  const sendPDFtoEmail = async (email: string) => {
    console.log('email', email);
    setEmailPrompt(false);
    state.globalLoading.set(true);
    const res = await generatePDf(
      userData?.masjid?.id!,
      monthlySchedule?.id!,
      email?.length < 1 ? [userData?.email!] : [userData?.email!, email],
    );
    if (res) {
      setSuccessPrompt(true);
      state.globalLoading.set(false);
    } else {
      state.globalLoading.set(false);
    }
  };

  // console.log('monthlySchedule?.updatedDate', monthlySchedule?.updatedDate);

  return (
    <View style={{ flex: 1, marginTop: 0, alignItems: 'center' }}>
      <MyModal
        visible={emailPrompt}
        onSend={email => sendPDFtoEmail(email)}
        message={`Monthly Schedule will emailed to ${userData?.email}.`}
        title1="Send"
        onBackDropPress={() => setEmailPrompt(false)}
      />
      <LogoutModal
        visible={successPrompt}
        message={`Monthly Schedule sent successfully.`}
        singleBtn
        onPress={() => setSuccessPrompt(false)}
      />
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
          <MyTitle text="Monthly Schedule" />
        </Animated.View>
      </View>

      <View>
        <GapView />
        {monthlySchedule ? (
          displayData?.map((item: any) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: WINDOW_WIDTH - 30,
                alignSelf: 'center',
                padding: 10,
                alignItems: 'center',
              }}>
              <MyText
                text={item.title}
                size={16}
                textStyle={{
                  marginRight: 10,
                }}
              />
              <TouchableOpacity
                onPress={
                  item.id == 3 && item.val != 'Not found'
                    ? () => Linking.openURL(monthlySchedule?.url)
                    : undefined
                }
                style={{ flexDirection: 'row' }}
                activeOpacity={
                  item.id == 3 && item.val != 'Not found' ? 0.5 : 1
                }>
                <MyText
                  text={item.val.toString()}
                  textStyle={{
                    fontSize: 14,
                    color:
                      item.id == 3 && item.val != 'Not found'
                        ? '#0097A3'
                        : '#6E6E6E',
                    textAlign: 'right',
                    textDecorationLine:
                      item.id == 3 && item.val != 'Not found'
                        ? 'underline'
                        : 'none',
                  }}
                  lines={1}
                />
                {item.id == 3 && item.val != 'Not found' && (
                  <>
                    <GapView length={5} mode="horizontal" />
                    <OpenLink width={18} height={18} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View>
            <MyText
              textStyle={{ textAlign: 'center', marginVertical: 10 }}
              text="Monthly schedule not published!"
            />
          </View>
        )}
      </View>
      <GapView />
      <Rounded
        label={monthlySchedule ? 'Update' : 'Publish'}
        onPress={
          monthlySchedule ? onUpdatePublishedSchedule : onPublishSchedule
        }
      />
      {monthlySchedule && monthlySchedule?.url && (
        <>
          <GapView />
          <Rounded
            label="Email PDF Copy"
            onPress={() => setEmailPrompt(true)}
            outlined
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
