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
  AddMasjidJummahTiming,
  GetMasjidIqamahTiming,
  GetMasjidJummahTiming,
  UpdatedMasjidIqamahTiming,
  UpdatedMasjidJummahTiming,
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
import {
  IqamahTime,
  JummahTime,
  jumuahsData,
} from '../../../../../../types/masjidControllerTypes';
import { Card } from '../../../../../../containers';
import { FlatList } from 'react-native-gesture-handler';

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
  selectedJumma: selectedJummmaData | null;
}) {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  let comingJumma = new Date();
  comingJumma.setDate(
    comingJumma.getDate() + ((0 - 1 - comingJumma.getDay() + 5) % 5) + 1,
  );

  useEffect(() => {
    if (jummaType == 'Edit') {
      setLoading(true);
      GetMasjidJummahTiming(
        '1',
        moment(selectedJumma?.date).format('YYYY-MM-DD'),
      ).then((jumuahTime: JummahTime) => {
        console.log('jumuahTimes', jumuahTime);

        setData(jumuahTime);
        setLoading(false);
      });
    } else {
      let defaultData = {
        effectiveDate: moment(comingJumma).format('YYYY-MM-DD'),
        jumuah1: '13:45:00',
        jumuah2: '15:15:00',
        jumuah3: null,
      };
      setData(defaultData);
    }
  }, []);

  const onUpdate = async () => {
    console.log('data', data);
    setLoading(true);
    await AddMasjidJummahTiming('1', data);
    setLoading(false);
    setEdit(false);
    setData(null);
    setFlag('jTime');
  };

  const type = data?.type;
  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ alignSelf: 'center', top: 110 }}>
          <Animated.View style={[{ opacity: contentOpacity }]}>
            <MyTitle text="Jumuah Timings" />
          </Animated.View>
          <GapView length={50} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 15 }}
          style={{ top: 110 }}>
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
                      loading ? new Date() : new Date(data.effectiveDate)
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
              {
                name: 'Jumuah 1',
                khutbahTiming:
                  data?.jumuah1 != null
                    ? moment(data?.jumuah1, 'HH:mm:ss').format('LT')
                    : '0',
                onChange: value => {
                  setData({
                    ...data,
                    jumuah1: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Jumuah 2',
                khutbahTiming:
                  data?.jumuah2 != null
                    ? moment(data?.jumuah2, 'HH:mm:ss').format('LT')
                    : '0',
                onChange: value => {
                  setData({
                    ...data,
                    jumuah2: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
              {
                name: 'Jumuah 3',
                khutbahTiming:
                  data?.jumuah3 != null
                    ? moment(data?.jumuah3, 'HH:mm:ss').format('LT')
                    : '0',
                onChange: value => {
                  setData({
                    ...data,
                    jumuah3: moment(value, 'hh:mm').format('HH:mm:ss'),
                  });
                },
              },
            ]}
            headings={['Salah', 'Khutbah']}
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
