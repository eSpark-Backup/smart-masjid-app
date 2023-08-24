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
  AddMasjidIqamahTiming,
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
  selectedIqamah,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  iqamahType: 'Add' | 'Edit';
  selectedIqamah?: object | null;
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (iqamahType == 'Edit') {
      setData(selectedIqamah);
    } else {
      let defaultData = {
        effectiveDate: moment(new Date()).format('YYYY-MM-DD'),
        type: 'D',
        asr: '18:00:00',
        fajr: '06:00:00',
        dhuhr: '14:00:00',
        isha: '21:30:00',
        maghribDelay: '15',
        fajrDelay: null,
        dhuhrDelay: null,
        asrDelay: null,
        ishaDelay: null,
      };
      setData(defaultData);
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

  const onUpdate = async () => {
    var dataObj: IqamahTime = data;
    // console.log('dataObj dataObj', dataObj);
    setLoading(true);
    if (
      (dataObj.type == 'D' && !Boolean(dataObj.fajrDelay)) ||
      !Boolean(dataObj.dhuhrDelay) ||
      !Boolean(dataObj.asrDelay) ||
      !Boolean(dataObj.maghribDelay) ||
      !Boolean(dataObj.ishaDelay)
    ) {
      if (iqamahType == 'Add') {
        await AddMasjidIqamahTiming('1', dataObj);
      } else {
        await UpdatedMasjidIqamahTiming('1', dataObj);
      }
    }
    setLoading(false);
    setData(null);
    setFlag('iTime');

    // if (
    //   (dataObj.type == 'D' && !Boolean(dataObj.fajrDelay)) ||
    //   !Boolean(dataObj.dhuhrDelay) ||
    //   !Boolean(dataObj.asrDelay) ||
    //   !Boolean(dataObj.maghribDelay) ||
    //   !Boolean(dataObj.ishaDelay)
    // ) {
    //   if ((iqamahType = 'Add')) {
    //     await AddMasjidIqamahTiming('1', dataObj);
    //   } else {
    //     await UpdatedMasjidIqamahTiming('1', dataObj);
    //   }
    // }

    // if (dataObj.type == 'F') {
    //   setLoading(true);
    //   await UpdatedMasjidIqamahTiming('1', {
    //     effectiveDate: dataObj.effectiveDate,
    //     type: dataObj.type,
    //     asr: dataObj.asr,
    //     fajr: dataObj.fajr,
    //     dhuhr: dataObj.dhuhr,
    //     isha: dataObj.isha,
    //     maghribDelay: dataObj.maghribDelay,
    //   });
    //   setLoading(false);
    //   setEdit(false);
    //   setData(null);
    // } else {
    //   if (
    //     !Boolean(dataObj.fajrDelay) ||
    //     !Boolean(dataObj.dhuhrDelay) ||
    //     !Boolean(dataObj.asrDelay) ||
    //     !Boolean(dataObj.maghribDelay) ||
    //     !Boolean(dataObj.ishaDelay)
    //   ) {
    //     Toast.show({
    //       text2: 'delay value should be greater than zero',
    //       type: 'error',
    //       visibilityTime: 10000,
    //     });
    //     return;
    //   }
    //   setLoading(true);
    //   await UpdatedMasjidIqamahTiming('1', {
    //     effectiveDate: dataObj.effectiveDate,
    //     type: dataObj.type,
    //     fajrDelay: dataObj.fajrDelay,
    //     dhuhrDelay: dataObj.dhuhrDelay,
    //     asrDelay: dataObj.asrDelay,
    //     maghribDelay: dataObj.maghribDelay,
    //     ishaDelay: dataObj.ishaDelay,
    //   });
    //   setLoading(false);
    //   setEdit(false);
    //   setData(null);
    // }
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
          <OverlayLoader isShow={loading} />
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
                iqamahTiming: edit
                  ? data?.maghribDelay?.toString()
                  : data?.maghribDelay?.toString(),
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
