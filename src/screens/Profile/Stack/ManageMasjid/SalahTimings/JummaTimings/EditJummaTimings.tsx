import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Animated, Platform } from 'react-native';
import moment from 'moment';

import {
  AddMasjidJummahTiming,
  GetMasjidCurrentJummahTiming,
  GetMasjidJummahTiming,
  UpdatedMasjidJummahTiming,
} from '../../../../../../api/masjidController';

import {
  GapView,
  MyTitle,
  OverlayLoader,
  Rounded,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';

import {
  AddJummas,
  JummahTime,
  jumuahsData,
} from '../../../../../../types/masjidControllerTypes';
import { useHookstate } from '@hookstate/core';
import { masjidStore } from '../../../../../../store/MasjidStore';
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';

interface selectedJummmaData {
  id: number;
  data: jumuahsData[];
  date: string;
}

export default function EditJummaTimings({
  setFlag,
  contentOpacity = 0,
  jummaType,
  selectedJumma,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  jummaType: 'Add' | 'Edit';
  selectedJumma?: selectedJummmaData | null;
}) {
  const masjid = useHookstate(masjidStore.masjid).get();
  const jummas = useHookstate(masjidStore.masjidsJummaSubs).get();
  const userData = useHookstate(userStore.userData).get();
  const [data, setData] = useState<AddJummas | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('jummas', jummas);

  // let comingJumma = new Date();
  // comingJumma.setDate(
  //   comingJumma.getDate() + ((0 - 1 - comingJumma.getDay() + 5) % 5) + 1,
  // );

  useEffect(() => {
    if (jummaType == 'Edit') {
      setLoading(true);
      GetMasjidCurrentJummahTiming(
        userData?.masjid.id.toString() as string,
        moment(selectedJumma?.date).format('YYYY-MM-DD'),
      ).then((jumuahTime: JummahTime | AddJummas) => {
        console.log('jumuahTimes', jumuahTime);

        setData(jumuahTime as AddJummas);
        setLoading(false);
      });
    } else {
      let defaultData: AddJummas = {
        effectiveDate: moment().format('YYYY-MM-DD'),
      };
      jummas?.jumma1 ? (defaultData.jumuah1 = '13:45:00') : null;
      jummas?.jumma2 ? (defaultData.jumuah2 = '15:15:00') : null;
      jummas?.jumma3 ? (defaultData.jumuah3 = '16:10:00') : null;
      setData(defaultData);
    }
  }, []);

  const onUpdate = async () => {
    console.log('data', data);
    setLoading(true);
    if (jummaType == 'Add') {
      await AddMasjidJummahTiming(
        userData?.masjid.id.toString() as string,
        data as AddJummas,
      );
    } else {
      await UpdatedMasjidJummahTiming(
        userData?.masjid.id.toString() as string,
        data as AddJummas,
      );
    }
    setLoading(false);
    setData(null);
    setFlag('jTime');
  };

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
            <MyTitle text="Jumuah Timings" />
          </Animated.View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          <OverlayLoader isShow={loading} />
          <TimeTable
            type={'J'}
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            header={
              <>
                <GapView />
                <View>
                  <MyDatePicker
                    currentDate={
                      loading
                        ? new Date()
                        : new Date(data?.effectiveDate as string)
                    }
                    minimumDate={new Date()}
                    onDateChange={date => {
                      if (new Date(date).getDay() == 5) {
                        console.log('done');
                        setData({
                          ...data,
                          effectiveDate: moment(date).format('YYYY-MM-DD'),
                        });
                      }
                    }}
                  />
                  <GapView length={20} />
                </View>
              </>
            }
            data={[
              jummas!.jumma1 && {
                name: 'Jumuah 1',
                khutbahTiming:
                  data?.jumuah1 != null
                    ? moment(data?.jumuah1, 'HH:mm:ss').format('LT')
                    : '0',
                onChange: value => {
                  setData({
                    ...(data as AddJummas),
                    jumuah1: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              jummas!.jumma2 && {
                name: 'Jumuah 2',
                khutbahTiming:
                  data?.jumuah2 != null
                    ? moment(data?.jumuah2, 'HH:mm:ss').format('LT')
                    : '0',
                onChange: value => {
                  setData({
                    ...(data as AddJummas),
                    jumuah2: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              jummas!.jumma3 && {
                name: 'Jumuah 3',
                khutbahTiming:
                  data?.jumuah3 != null
                    ? moment(data?.jumuah3, 'HH:mm:ss').format('LT')
                    : '0',
                onChange: value => {
                  setData({
                    ...(data as AddJummas),
                    jumuah3: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
            ]}
            headings={['Salah', 'Khutbah']}
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
