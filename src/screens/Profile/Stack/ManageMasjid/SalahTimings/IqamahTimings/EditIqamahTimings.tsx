import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Animated, Platform } from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  AddMasjidIqamahTiming,
  UpdateMasjidIqamahTiming,
} from '../../../../../../api/masjidController';

import {
  GapView,
  MyDropDown,
  MyTitle,
  OverlayLoader,
  Rounded,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { IqamahTime } from '../../../../../../types/masjidControllerTypes';
import { userStore } from '../../../../../../store/UserStore';
import { globalStore } from '../../../../../../store/GlobalStates';
import { GlobalProps } from '../../../../../../types';

export default function EditIqamahTimings({
  setFlag,
  contentOpacity = 0,
  iqamahType,
  selectedIqamah,
  getUp,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  iqamahType: 'Add' | 'Edit';
  selectedIqamah?: IqamahTime | null;
  getUp?: () => void;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const userData = useHookstate(userStore.userData).get();
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (iqamahType == 'Edit') {
      setData(selectedIqamah);
    } else {
      let defaultData = {
        effectiveDate: moment().format('YYYY-MM-DD'),
        type: 'F',
        asr: null,
        fajr: null,
        dhuhr: null,
        isha: null,
        maghribDelay: '0',
        fajrDelay: '0',
        dhuhrDelay: '0',
        asrDelay: '0',
        ishaDelay: '0',
      };
      setData(defaultData);
    }
  }, []);

  const onUpdate = async () => {
    getUp?.();
    var dataObj: IqamahTime = data;
    state.globalLoading.set(true);
    if (iqamahType == 'Add') {
      const res = await AddMasjidIqamahTiming(
        userData?.masjid?.id.toString() as string,
        dataObj,
      );
      if (res == '200') {
        setData(null);
        setFlag('iTime');
      }
    } else {
      const res = await UpdateMasjidIqamahTiming(
        userData?.masjid?.id.toString() as string,
        dataObj,
      );
      if (res == '200') {
        setData(null);
        setFlag('iTime');
      }
    }
    state.globalLoading.set(false);
  };

  const type = data?.type;
  return (
    <>
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
            <MyTitle text="Iqama Timings" />
          </Animated.View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {/* <OverlayLoader isShow={loading} /> */}
          <TimeTable
            type={data?.type}
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            header={
              <>
                <View>
                  <MyDropDown
                    title={''}
                    searchDisabled={true}
                    placeholder="Select Iqama Type"
                    items={[
                      { id: 1, name: 'Fixed' },
                      { id: 2, name: 'Delay' },
                    ]}
                    defaultValue={{
                      id: data?.type == 'Fixed' ? 1 : 2,
                      name: data?.type == 'F' ? 'Fixed' : 'Delay',
                    }}
                    width={WINDOW_WIDTH - 50}
                    onChangeValue={e => {
                      if (
                        iqamahType == 'Edit' &&
                        e.name == 'Fixed' &&
                        selectedIqamah?.type == 'D'
                      ) {
                        let defaultData = {
                          ...selectedIqamah,
                          effectiveDate: data.effectiveDate,
                          asr: null,
                          fajr: null,
                          dhuhr: null,
                          isha: null,
                        };
                        setData({
                          ...defaultData,
                          type: e.name == 'Fixed' ? 'F' : 'D',
                        });
                      } else if (
                        iqamahType == 'Edit' &&
                        e.name == 'Delay' &&
                        selectedIqamah?.type == 'F'
                      ) {
                        let defaultData = {
                          ...selectedIqamah,
                          effectiveDate: data.effectiveDate,
                          fajrDelay: '0',
                          dhuhrDelay: '0',
                          asrDelay: '0',
                          ishaDelay: '0',
                        };
                        setData({
                          ...defaultData,
                          type: e.name == 'Delay' ? 'D' : 'F',
                        });
                      } else {
                        setData({
                          ...data,
                          type: e.name == 'Fixed' ? 'F' : 'D',
                        });
                      }
                    }}
                  />
                  <GapView length={20} />
                  <MyDatePicker
                    currentDate={
                      moment(data?.effectiveDate, 'YYYY-MM-DD').toDate() ??
                      new Date()
                    }
                    minimumDate={new Date()}
                    onDateChange={date => {
                      console.log(
                        'moment(date).format(YYYY-MM-DD)',
                        moment(date).format('YYYY-MM-DD'),
                      );

                      setData({
                        ...data,
                        effectiveDate: moment(date).format('YYYY-MM-DD'),
                      });
                    }}
                  />
                  <GapView length={20} />
                </View>
              </>
            }
            data={[
              {
                name: 'Fajr',
                iqamahTiming:
                  type == 'F'
                    ? data?.fajr != null
                      ? moment(data?.fajr, 'HH:mm:ss').format('LT')
                      : '-'
                    : data?.fajrDelay?.toString() ?? '0',
                onChange: value => {
                  setData({
                    ...data,
                    [type == 'F' ? 'fajr' : 'fajrDelay']:
                      data?.type == 'D'
                        ? value
                        : moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Dhuhr',
                iqamahTiming:
                  type == 'F'
                    ? data?.dhuhr != null
                      ? moment(data?.dhuhr, 'HH:mm:ss').format('LT')
                      : '-'
                    : data?.dhuhrDelay?.toString() ?? '0',
                onChange: value => {
                  setData({
                    ...data,
                    [type == 'F' ? 'dhuhr' : 'dhuhrDelay']:
                      data?.type == 'D'
                        ? value
                        : moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Asr',
                iqamahTiming:
                  type == 'F'
                    ? data?.asr != null
                      ? moment(data?.asr, 'HH:mm:ss').format('LT')
                      : '-'
                    : data?.asrDelay?.toString() ?? '0',
                onChange: value => {
                  setData({
                    ...data,
                    [type == 'F' ? 'asr' : 'asrDelay']:
                      data?.type == 'D'
                        ? value
                        : moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Maghrib',
                iqamahTiming: data?.maghribDelay?.toString(),
                onChange: value => {
                  setData({
                    ...data,
                    maghribDelay: value,
                  });
                },
              },
              {
                name: 'Isha',
                iqamahTiming:
                  type == 'F'
                    ? data?.isha != null
                      ? moment(data?.isha, 'HH:mm:ss').format('LT')
                      : '-'
                    : data?.ishaDelay?.toString() ?? '0',
                onChange: value => {
                  setData({
                    ...data,
                    [type == 'F' ? 'isha' : 'ishaDelay']:
                      data?.type == 'D'
                        ? value
                        : moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
            ]}
            headings={['Salah', 'Iqama']}
            editView={true}
            footer={
              <>
                <View style={{ alignSelf: 'center' }}>
                  <GapView />
                  <Rounded label="Save" onPress={onUpdate} />
                </View>
              </>
            }
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
