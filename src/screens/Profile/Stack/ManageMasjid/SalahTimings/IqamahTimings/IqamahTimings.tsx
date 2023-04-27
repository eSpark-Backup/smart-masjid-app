import { useHookstate } from '@hookstate/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  GetMasjidIqamahTiming,
  UpdatedMasjidIqamahTiming,
} from '../../../../../../api/masjidController';
import { EditTimeTable, History } from '../../../../../../assets';
import Toast from 'react-native-toast-message';

import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  OverlayLoader,
  ProfileAvatar,
  Rounded,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { IqamahTime } from '../../../../../../types/masjidControllerTypes';

export default function IqamahTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetMasjidIqamahTiming('1');
  }, []);

  const onUpdate = async () => {
    var dataObj: IqamahTime = data;
    console.log('dataObj dataObj', dataObj);

    if (dataObj.type == 'F') {
      setLoading(true);
      await UpdatedMasjidIqamahTiming('1', {
        changeDate: dataObj.changeDate,
        type: dataObj.type,
        asr: dataObj.asr,
        fajr: dataObj.fajr,
        dhuhr: dataObj.dhuhr,
        isha: dataObj.isha,
        maghribDelay: dataObj.maghribDelay,
      });
      setLoading(false);
      setEdit(false);
      setData(null);
    } else {
      if (
        !Boolean(dataObj.fajrDelay) ||
        !Boolean(dataObj.dhuhrDelay) ||
        !Boolean(dataObj.asrDelay) ||
        !Boolean(dataObj.maghribDelay) ||
        !Boolean(dataObj.ishaDelay)
      ) {
        Toast.show({
          text2: 'delay value should be greater than zero',
          type: 'error',
        });
        return;
      }
      setLoading(true);
      await UpdatedMasjidIqamahTiming('1', {
        changeDate: dataObj.changeDate,
        type: dataObj.type,
        fajrDelay: dataObj.fajrDelay,
        dhuhrDelay: dataObj.dhuhrDelay,
        asrDelay: dataObj.asrDelay,
        maghribDelay: dataObj.maghribDelay,
        ishaDelay: dataObj.ishaDelay,
      });
      setLoading(false);
      setEdit(false);
      setData(null);
    }
  };

  const type = data?.type ?? iqamahTimings?.type;
  return (
    <>
      <GapView length={30} />
      <View style={{ flex: 1, marginTop: 70 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}>
          <OverlayLoader isShow={loading} />

          <TimeTable
            type={data?.type ?? iqamahTimings?.type}
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
                        id: data?.type == 'F' ? 1 : 2,
                        name: data?.type ?? '',
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
                iqamahTiming:
                  type == 'F'
                    ? moment(iqamahTimings?.fajr, 'HH:mm:ss').format('hh:mm')
                    : iqamahTimings?.fajrDelay?.toString() ?? '0',
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
                name: 'Dhur',
                iqamahTiming:
                  type == 'F'
                    ? moment(iqamahTimings?.dhuhr, 'HH:mm:ss').format('hh:mm')
                    : iqamahTimings?.dhuhrDelay?.toString() ?? '0',
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
                    ? moment(iqamahTimings?.asr, 'HH:mm:ss').format('hh:mm')
                    : iqamahTimings?.asrDelay?.toString() ?? '0',
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
                name: 'Mugrib',
                iqamahTiming: iqamahTimings?.maghribDelay?.toString(),
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
                    ? moment(iqamahTimings?.isha, 'HH:mm:ss').format('hh:mm')
                    : iqamahTimings?.ishaDelay?.toString() ?? '0',
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
            headings={['Salah', 'Iqamah']}
            editView={edit}
            footer={
              <>
                {edit && (
                  <View style={{ alignSelf: 'center' }}>
                    <GapView />
                    <Rounded label="Save" onPress={onUpdate} />
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
