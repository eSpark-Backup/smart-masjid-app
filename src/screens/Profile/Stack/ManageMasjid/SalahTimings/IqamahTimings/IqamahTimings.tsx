import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import {
  GetMasjidIqamahTiming,
  UpdatedMasjidIqamahTiming,
} from '../../../../../../api/masjidController';
import { EditTimeTable, History } from '../../../../../../assets';
import {
  GapView,
  MyDropDown,
  MyText,
  OverlayLoader,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { IqamahTime } from '../../../../../../types/masjidControllerTypes';

export default function IqamahTimings({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetMasjidIqamahTiming('1');
    console.log('kia ha',moment(iqamahTimings?.fajr, 'HH:mm:ss').format('LT'))
  }, []);

  const onUpdate = async () => {
    var dataObj: IqamahTime = data;
    console.log('dataObj dataObj', dataObj);

    if (dataObj.type == 'F') {
      setLoading(true);
      await UpdatedMasjidIqamahTiming('1', {
        effectiveDate: dataObj.effectiveDate,
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
          visibilityTime: 10000,
        });
        return;
      }
      setLoading(true);
      await UpdatedMasjidIqamahTiming('1', {
        effectiveDate: dataObj.effectiveDate,
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
      <View style={{ flex: 1 }}>
        <View style={{ alignSelf: 'center', top: 110 }}>
          <Animated.View style={[{ opacity: contentOpacity }]}>
            <TextLabel
              label="Iqama Timings"
              textStyle={{ alignSelf: 'center' }}
            />
          </Animated.View>
          <GapView length={50} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ top: 110 }}>
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
                        text={`Effective Date: ${iqamahTimings?.effectiveDate}`}
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
                      onChangeValue={e =>
                        setData({
                          ...data,
                          type: e.name == 'Fixed' ? 'F' : 'D',
                        })
                      }
                    />
                    <GapView />
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
                )}
              </>
            }
            data={[
              {
                name: 'Fajr',
                iqamahTiming:
                  type == 'F'
                    ? moment(iqamahTimings?.fajr, 'HH:mm:ss').format('LT')
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
                name: 'Dhuhr',
                iqamahTiming:
                  type == 'F'
                    ? moment(iqamahTimings?.dhuhr, 'HH:mm:ss').format('LT')
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
                    ? moment(iqamahTimings?.asr, 'HH:mm:ss').format('LT')
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
                name: 'Maghrib',
                iqamahTiming: edit
                  ? iqamahTimings?.maghribDelay?.toString()
                  : `+${iqamahTimings?.maghribDelay?.toString()} mins`,
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
                    ? moment(iqamahTimings?.isha, 'HH:mm:ss').format('LT')
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
            headings={['Salah', 'Iqama']}
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
