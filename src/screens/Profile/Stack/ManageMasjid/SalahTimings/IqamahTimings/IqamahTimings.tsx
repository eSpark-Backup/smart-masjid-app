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
import TimeTableCard from '../../../../../../components/TimeTableCard';

export default function IqamahTimings({
  setFlag,
  contentOpacity = 0,
  selectedIqamah,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  selectedIqamah: (value: object) => void;
}) {
  const [edit, setEdit] = useState(false);
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetMasjidIqamahTiming('1').then(iqamahTime => {
      let iqamahData = [];
      iqamahTime?.map((i: IqamahTime) => {
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
      setLoading(false);
    });
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

  const foundIndex = iqamahTimings?.findIndex(
    e => new Date(e.effectiveDate).toString() === new Date().toString(),
  );

  const contentToRender = () => {
    return foundIndex! > -1 ? (
      data
        .filter(
          item => new Date(item.date).toString() === new Date().toString(),
        )
        .map(item => (
          <TimeTableCard
            onEdit={() => {
              console.log('item', iqamahTimings![foundIndex!]);
              setFlag('iEdit');
            }}
            date={item.date}
            data={item.data}
          />
        ))
    ) : (
      <MyText
        textStyle={{ textAlign: 'center', marginVertical: 10 }}
        text="Nothing to show yet!"
      />
    );
  };

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
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }}
          style={{ top: 110 }}>
          <OverlayLoader isShow={loading} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingBottom: 5,
            }}>
            <MyTextSubHeader text="Current" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlusCircle onPress={() => setFlag('iAdd')} />
              <GapView mode="horizontal" />
              <HistoryBox onPress={() => setFlag('iHist')} />
            </View>
          </View>
          {data.length > 0 ? (
            contentToRender()
          ) : loading ? null : (
            <MyText
              textStyle={{ textAlign: 'center', marginVertical: 10 }}
              text="Nothing to show yet!"
            />
          )}
          <View
            style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5 }}>
            <MyTextSubHeader text="Upcoming" />
          </View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TimeTableCard
                onEdit={() => {
                  const ind = iqamahTimings?.findIndex(e => e.id == item.id);
                  selectedIqamah(iqamahTimings![ind!]);
                  setFlag('iEdit');
                }}
                key={item.date}
                date={item.date}
                data={item.data}
                deleteBtn
              />
            )}
            ListEmptyComponent={
              loading ? null : (
                <MyText
                  textStyle={{ textAlign: 'center', marginVertical: 10 }}
                  text="Nothing to show yet!"
                />
              )
            }
          />
        </ScrollView>
      </View>
    </>
  );
}

interface TimeTableData {
  name: string;
  value: string;
}

// const TimeTableCard = ({
//   data = [],
//   date = '',
//   deleteBtn,
//   onEdit,
// }: {
//   data: TimeTableData[];
//   date: string;
//   deleteBtn?: boolean;
//   onEdit?: () => void;
// }) => {
//   return (
//     <View style={{ marginVertical: 5 }}>
//       <Card width={WINDOW_WIDTH - 28}>
//         <View style={{ padding: 10 }}>
//           <View
//             style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <Calendar style={{ color: '#6E6E6E' }} />
//               <GapView length={5} />
//               <MyText text={date} size={12} />
//             </View>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               {deleteBtn ? <Delete /> : null}
//               <GapView length={5} mode="horizontal" />
//               <EditPencil onPress={onEdit} />
//             </View>
//           </View>
//           <GapView />
//           <MyDivider width={WINDOW_WIDTH - 48} />
//           <GapView />
//           <View
//             style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             {data.map(v => {
//               return (
//                 <View>
//                   <MyText
//                     textStyle={{ textTransform: 'capitalize' }}
//                     text={v.name}
//                   />
//                   <GapView length={5} />
//                   <MyText
//                     size={12}
//                     textStyle={{ color: '#6E6E6E' }}
//                     text={v.value}
//                   />
//                 </View>
//               );
//             })}
//           </View>
//         </View>
//       </Card>
//     </View>
//   );
// };

const styles = StyleSheet.create({});
