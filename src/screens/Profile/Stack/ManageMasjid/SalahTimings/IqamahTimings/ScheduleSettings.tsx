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
import crashlytics from '@react-native-firebase/crashlytics';

import {
  GetJummahHistory,
  generatePDf,
  getSalahTimingsOfMasjid,
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
import {
  JummahTime,
  SalahTimings,
} from '../../../../../../types/masjidControllerTypes';
import { convertResponseToData } from '../../../../../../utils/functions';
import { WINDOW_WIDTH } from '../../../../../../constants';
import {
  GetMonthlySchedule,
  PublishMonthlySchedule,
  UpdatePublishedMonthlySchedule,
} from '../../../../../../api/userController';
import { GlobalProps } from '../../../../../../types';
import { globalStore } from '../../../../../../store/GlobalStates';
import { OpenLink } from '../../../../../../assets';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { ScheduleResponse } from '../../../../../../types/userControllerApiResponse';

export default function ScheduleSettings({
  setFlag,
  contentOpacity = 0,
  setCurrDate,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  setCurrDate: (date: Date) => void;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();
  const schedule = useHookstate(userStore.monthlySchedule);
  const monthlySchedule = useHookstate(userStore.monthlySchedule).get();

  const [emailPrompt, setEmailPrompt] = useState(false);
  const [successPrompt, setSuccessPrompt] = useState(false);
  const [displayData, setdisplayData] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthSchedule, setMonthSchedule] = useState<ScheduleResponse | null>(
    null,
  );

  useEffect(() => {
    getScheduleData();
  }, []);

  const updateMonthlySchInfo = (
    monthlySchedule: ScheduleResponse | null,
    date?: Date,
  ) => {
    if (monthlySchedule) {
      setMonthSchedule(monthlySchedule);
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
    } else {
      setMonthSchedule(null);
      setdisplayData([
        {
          id: 0,
          title: 'Month',
          val: moment().month(date?.getMonth()!).format('MMMM') ?? 'March',
        },
        {
          id: 1,
          title: 'Year',
          val: date?.getFullYear() ?? '2023',
        },
        {
          id: 3,
          title: 'PDF',
          val: 'Not found',
        },
        {
          id: 4,
          title: 'Published Date',
          val: '-',
        },
        {
          id: 5,
          title: 'Updated Date',
          val: '-',
        },
      ]);
    }
  };

  const getScheduleData = async (date?: Date) => {
    state.globalLoading.set(true);
    const res = await GetMonthlySchedule(
      userData?.masjid.id!,
      date ? date.getMonth() + 1 : currentDate.getMonth() + 1,
      date ? date.getFullYear() : currentDate.getFullYear(),
    );
    if (res) {
      state.globalLoading.set(false);
      updateMonthlySchInfo(res);
    } else {
      state.globalLoading.set(false);
      updateMonthlySchInfo(null, date);
    }
  };

  const onDateChange = async (e: Date) => {
    setCurrentDate(e);
    state.globalLoading.set(true);
    getScheduleData(e);
    // getSalahTimingsOfMasjid(
    //   userData?.masjid?.id.toString() as string,
    //   moment(e).startOf('month').format('YYYY-MM-DD') as string,
    //   'MONTH',
    // ).then((timings: SalahTimings[] | undefined) => {
    //   // convertTimings(timings);
    //   state.globalLoading.set(false);
    // });
  };

  const onPublishSchedule = async () => {
    state.globalLoading.set(true);
    const res = await PublishMonthlySchedule(
      userData?.masjid?.id!,
      currentDate,
    );
    if (res) {
      updateMonthlySchInfo(res);
      state.globalLoading.set(false);
    } else {
      state.globalLoading.set(false);
    }
  };

  const onUpdatePublishedSchedule = async () => {
    state.globalLoading.set(true);
    const res = await UpdatePublishedMonthlySchedule(
      userData?.masjid?.id!,
      monthSchedule?.id!,
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
      monthSchedule?.id!,
      email?.length < 1 ? [userData?.email!] : [userData?.email!, email],
    );
    if (res) {
      setSuccessPrompt(true);
      state.globalLoading.set(false);
    } else {
      state.globalLoading.set(false);
    }
  };

  console.log(
    'monthlySchedule',
    moment().month(currentDate.getMonth()).format('M'),
  );

  return (
    <View
      style={{
        flex: 1,
        marginTop: 0,
        alignItems: 'center',
      }}>
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
        <MyDatePicker
          minimumDate={moment().startOf('month').date(2).toDate()}
          maximumDate={moment().add(4, 'month').date(1).toDate()}
          disablePicker
          type="standard"
          // currentDate={currentDate.getMonth}
          currentDate={moment()
            .year(currentDate.getFullYear())
            .month(currentDate.getMonth())
            .date(1)
            .toDate()}
          onDateChange={onDateChange}
          dateFormat={'Monthly'}
        />
        {displayData?.map((item: any) => (
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
                  ? () => Linking.openURL(monthSchedule?.url!)
                  : undefined
              }
              style={{ flexDirection: 'row' }}
              activeOpacity={item.id == 3 && item.val != 'Not found' ? 0.5 : 1}>
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
        ))}
      </View>
      <GapView />
      <Rounded
        label={monthSchedule ? 'Update' : 'Publish'}
        onPress={monthSchedule ? onUpdatePublishedSchedule : onPublishSchedule}
      />
      <>
        <GapView />
        <Rounded
          label="View Schedule"
          onPress={() => {
            setCurrDate(currentDate);
            setFlag('Hist');
          }}
          outlined
        />
      </>
      <>
        <GapView />
        <Rounded
          disabled={!crashlytics().isCrashlyticsCollectionEnabled}
          label="Crash App"
          onPress={() => {
            crashlytics().crash();
          }}
          outlined
        />
      </>
      {monthSchedule && monthSchedule?.url && (
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
