import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  LogBox,
} from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import {
  GetMasjidIqamahTiming,
  UpdatedMasjidIqamahTiming,
} from '../../../../../../api/masjidController';
import {
  Calendar,
  Delete,
  EditPencil,
  EditTimeTable,
  History,
  HistoryBox,
  PlusCircle,
} from '../../../../../../assets';
import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  MyTextSubHeader,
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

export default function EditIqamahTimings({
  setFlag,
  contentOpacity = 0,
  iqamahType,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  iqamahType: 'Add' | 'Edit';
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (iqamahType == 'Edit') {
      GetMasjidIqamahTiming('1').then(iqamahTime => {
        let iqamahData = [];
        iqamahTime?.map((i: IqamahTime) => {
          const namazData = {
            id: i.id,
            date: i.effectiveDate,
            data: [
              { name: 'fajr', value: moment(i?.fajr, 'HH:mm:ss').format('LT') },
              {
                name: 'dhuhr',
                value: moment(i?.dhuhr, 'HH:mm:ss').format('LT'),
              },
              { name: 'asr', value: moment(i?.asr, 'HH:mm:ss').format('LT') },
              { name: 'maghrib', value: '+' + i.maghribDelay + ' mins' },
              { name: 'isha', value: moment(i?.isha, 'HH:mm:ss').format('LT') },
            ],
            type: i.type,
          };
          iqamahData.push(namazData);
        });
        setData(iqamahData[0]);
      });
    }
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

  useEffect(() => {}, []);
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

  const type = data?.type;
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
          contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 15 }}
          style={{ top: 110 }}>
          <TimeTable
            type={data?.type}
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            header={
              <>
                <GapView />

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
                    onChangeValue={e =>
                      setData({
                        ...data,
                        type: e.name == 'Fixed' ? 'F' : 'D',
                      })
                    }
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
                    ? moment(iqamahTimings[0].fajr, 'HH:mm:ss').format('LT')
                    : iqamahTimings[0].fajrDelay?.toString() ?? '0',
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
                    ? moment(iqamahTimings[0].dhuhr, 'HH:mm:ss').format('LT')
                    : iqamahTimings[0].dhuhrDelay?.toString() ?? '0',
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
                    ? moment(iqamahTimings[0].asr, 'HH:mm:ss').format('LT')
                    : iqamahTimings[0].asrDelay?.toString() ?? '0',
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
                  ? iqamahTimings[0].maghribDelay?.toString()
                  : iqamahTimings[0].maghribDelay?.toString(),
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
                    ? moment(iqamahTimings[0].isha, 'HH:mm:ss').format('LT')
                    : iqamahTimings[0].ishaDelay?.toString() ?? '0',
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
                {/* {edit && ( */}
                <View style={{ alignSelf: 'center' }}>
                  <GapView />
                  <Rounded label="Save" onPress={onUpdate} />
                </View>
                {/* )} */}
              </>
            }
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
