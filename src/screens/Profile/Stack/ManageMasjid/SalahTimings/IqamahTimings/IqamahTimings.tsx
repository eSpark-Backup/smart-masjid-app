import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import {
  GetMasjidIqamahTiming,
  UpdatedMasjidIqamahTiming,
} from '../../../../../../api/masjidController';
import {
  Calendar,
  EditPencil,
  EditTimeTable,
  History,
} from '../../../../../../assets';
import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  MyTitle,
  OverlayLoader,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { IqamahTime } from '../../../../../../types/masjidControllerTypes';
import { Card } from '../../../../../../containers';
import { FlatList } from 'react-native-gesture-handler';

export default function IqamahTimings({
  setFlag,
  contentOpacity = 0,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetMasjidIqamahTiming('1');
  }, []);

  // const namazData = [
  //   {
  //     date: '2023-07-14',
  //     data: [
  //       { name: 'fajr', value: '18:00:00' },
  //       { name: 'duhr', value: '18:00' },
  //       { name: 'asr', value: '18:00' },
  //       { name: 'maghrib', value: '18:00' },
  //       { name: 'isha', value: '18:00' },
  //     ],
  //     type: 'F',
  //   },
  //   {
  //     date: '2023-07-16',
  //     data: [
  //       { name: 'fajr', value: '16:00' },
  //       { name: 'duhr', value: '16:00' },
  //       { name: 'asr', value: '16:00' },
  //       { name: 'maghrib', value: '16:00' },
  //       { name: 'isha', value: '16:00' },
  //     ],
  //   },
  // ];

  useEffect(() => {
    setData([]);
    let iqamahData = [...data];
    iqamahTimings?.map(i => {
      const namazData = {
        id: i.id,
        date: i.effectiveDate,
        data: [
          { name: 'fajr', value: moment(i?.fajr, 'HH:mm:ss').format('LT') },
          { name: 'dhuhr', value: moment(i?.dhuhr, 'HH:mm:ss').format('LT') },
          { name: 'asr', value: moment(i?.asr, 'HH:mm:ss').format('LT') },
          { name: 'maghrib', value: '+' + i.maghribDelay + ' mins' },
          { name: 'isha', value: moment(i?.isha, 'HH:mm:ss').format('LT') },
        ],
        type: i.type,
      };
      iqamahData.push(namazData);
    });
    setData(iqamahData);
  }, []);
  console.log('IqamahData', data[0]);

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

  console.log('iqamahTimings', iqamahTimings);

  // const type = data?.type ?? iqamahTimings?.type;
  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ alignSelf: 'center', top: 110 }}>
          <Animated.View style={[{ opacity: contentOpacity }]}>
            <MyTitle text="Iqama Timings" />
          </Animated.View>
          <GapView length={50} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ top: 110 }}>
          <OverlayLoader isShow={loading} />
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TimeTableCard date={item.date} data={item.data} />
            )}
          />

          {/* <TimeTable
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
          /> */}
        </ScrollView>
      </View>
    </>
  );
}

interface TimeTableData {
  name: string;
  value: string;
}

const TimeTableCard = ({
  data = [],
  date = '',
}: {
  data: TimeTableData[];
  date: string;
}) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Card width={WINDOW_WIDTH - 28}>
        <View style={{ padding: 10 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar style={{ color: '#6E6E6E' }} />
              <GapView length={5} />
              <MyText text={date} size={12} />
            </View>
            <EditPencil />
          </View>
          <GapView />
          <MyDivider width={WINDOW_WIDTH - 48} />
          <GapView />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {data.map(v => {
              return (
                <View>
                  <MyText
                    textStyle={{ textTransform: 'capitalize' }}
                    text={v.name}
                  />
                  <GapView length={5} />
                  <MyText
                    size={12}
                    textStyle={{ color: '#6E6E6E' }}
                    text={v.value}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({});
