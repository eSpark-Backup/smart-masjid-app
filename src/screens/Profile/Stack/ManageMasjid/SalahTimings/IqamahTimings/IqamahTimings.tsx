import { useHookstate } from '@hookstate/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { GetMasjidIqamahTiming } from '../../../../../../api/masjidController';
import { EditTimeTable, History } from '../../../../../../assets';

import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  ProfileAvatar,
  Rounded,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { masjidStore } from '../../../../../../store/MasjidStore';

export default function IqamahTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>({});

  useEffect(() => {
    GetMasjidIqamahTiming('1');
  }, []);


  return (
    <>
      <GapView length={30} />
      <View style={{ flex: 1, marginTop: 70 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}>
          <TimeTable
            header={
              <>
                <GapView />
                {!edit ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 5,
                    }}>
                    <View>
                      <MyText
                        text={`Change Date: ${iqamahTimings?.changeDate}`}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <History onPress={() => setFlag('iHist')} />
                      <GapView mode="horizontal" length={20} />
                      <EditTimeTable
                        onPress={() => {
                          setEdit(true);
                          setData(iqamahTimings ?? {});
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <MyDropDown
                      title={''}
                      placeholder="Select Iqama Type"
                      items={[
                        { id: 1, name: 'F' },
                        { id: 2, name: 'D' },
                      ]}
                      defaultValue={{
                        id: iqamahTimings?.type == 'F' ? 1 : 2,
                        name: iqamahTimings?.type ?? '',
                      }}
                      width={WINDOW_WIDTH - 65}
                      onChangeValue={e => setData({ ...data, type: e.name })}
                    />
                    <GapView />
                    <MyDatePicker
                      currentDate={new Date(data?.changeDate ?? new Date())}
                      onDateChange={date => {
                        setData({
                          ...data,
                          changeDate: moment(date).format('YYYY-MM-DD'),
                        });
                      }}
                    />
                    <GapView length={20} />
                  </View>
                )}
              </>
            }
            data={[
              {
                name: 'Fajr',
                iqamahTiming: moment(iqamahTimings?.fajr, 'HH:mm:ss')
                  .add('minute', iqamahTimings?.fajrDelay ?? 0)
                  .format('hh:mm'),
                onChange: value => {
                  setData({
                    ...data,
                    fajr: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Dhur',
                iqamahTiming: moment(iqamahTimings?.dhuhr, 'HH:mm:ss')
                  .add('minute', iqamahTimings?.dhuhrDelay ?? 0)
                  .format('hh:mm'),
                onChange: value => {
                  setData({
                    ...data,
                    dhuhr: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Asr',
                iqamahTiming: moment(iqamahTimings?.asr, 'HH:mm:ss')
                  .add('minute', iqamahTimings?.asrDelay ?? 0)
                  .format('hh:mm'),
                onChange: value => {
                  setData({
                    ...data,
                    asr: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Mugrib',
                iqamahTiming: moment(iqamahTimings?.fajr, 'HH:mm:ss')
                  .add('minute', iqamahTimings?.maghribDelay ?? 0)
                  .format('hh:mm'),
                onChange: value => {
                  setData({
                    ...data,
                    fajr: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Isha',
                iqamahTiming: moment(iqamahTimings?.isha, 'HH:mm:ss')
                  .add('minute', iqamahTimings?.ishaDelay ?? 0)
                  .format('hh:mm'),
                onChange: value => {
                  setData({
                    ...data,
                    isha: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
            ]}
            headings={['Salah', 'Iqamah']}
            editView={edit}
            footer={
              <>
                {edit && (
                  <View style={{ alignSelf: 'center' }}>
                    <GapView />
                    <Rounded label="Save" onPress={() => setEdit(false)} />
                  </View>
                )}
              </>
            }
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
