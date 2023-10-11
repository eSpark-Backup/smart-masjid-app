import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Animated, Platform } from 'react-native';
import { useHookstate } from '@hookstate/core';
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

export default function EditIqamahTimings({
  setFlag,
  contentOpacity = 0,
  iqamahType,
  selectedIqamah,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  iqamahType: 'Add' | 'Edit';
  selectedIqamah?: IqamahTime | null;
}) {
  const userData = useHookstate(userStore.userData).get();
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (iqamahType == 'Edit') {
      setData(selectedIqamah);
    } else {
      let defaultData = {
        effectiveDate: moment(new Date()).format('YYYY-MM-DD'),
        type: 'F',
        asr: '18:00:00',
        fajr: '06:00:00',
        dhuhr: '14:00:00',
        isha: '21:30:00',
        maghribDelay: '15',
        fajrDelay: '0',
        dhuhrDelay: '0',
        asrDelay: '0',
        ishaDelay: '0',
      };
      setData(defaultData);
    }
  }, []);

  const onUpdate = async () => {
    var dataObj: IqamahTime = data;
    setLoading(true);
    console.log('iqamah data', data);
    if (iqamahType == 'Add') {
      await AddMasjidIqamahTiming(
        userData?.masjid.id.toString() as string,
        dataObj,
      );
    } else {
      await UpdateMasjidIqamahTiming(
        userData?.masjid.id.toString() as string,
        dataObj,
      );
    }
    // if (
    //   (dataObj.type == 'D' && !Boolean(dataObj.fajrDelay)) ||
    //   !Boolean(dataObj.dhuhrDelay) ||
    //   !Boolean(dataObj.asrDelay) ||
    //   !Boolean(dataObj.maghribDelay) ||
    //   !Boolean(dataObj.ishaDelay)
    // ) {
    // }
    setLoading(false);
    setData(null);
    setFlag('iTime');
  };

  console.log('data', data);

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
          <OverlayLoader isShow={loading} />
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
                    // searchDisabled={true}
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
                          effectiveDate: moment(new Date()).format(
                            'YYYY-MM-DD',
                          ),
                          asr: '18:00:00',
                          fajr: '06:00:00',
                          dhuhr: '14:00:00',
                          isha: '21:30:00',
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
                          effectiveDate: moment(new Date()).format(
                            'YYYY-MM-DD',
                          ),
                          fajrDelay: '10',
                          dhuhrDelay: '10',
                          asrDelay: '10',
                          ishaDelay: '10',
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
                    currentDate={new Date(data?.effectiveDate ?? new Date())}
                    minimumDate={new Date()}
                    onDateChange={date => {
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
                    ? moment(data?.fajr, 'HH:mm:ss').format('LT')
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
                    ? moment(data?.dhuhr, 'HH:mm:ss').format('LT')
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
                    ? moment(data?.asr, 'HH:mm:ss').format('LT')
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
                    ? moment(data?.isha, 'HH:mm:ss').format('LT')
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
