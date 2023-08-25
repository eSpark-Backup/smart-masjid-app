import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Animated } from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';

import { GetMasjidIqamahTiming } from '../../../../../../api/masjidController';
import { HistoryBox, PlusCircle } from '../../../../../../assets';
import {
  GapView,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
} from '../../../../../../components';

import { masjidStore } from '../../../../../../store/MasjidStore';
import { IqamahTime } from '../../../../../../types/masjidControllerTypes';
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

  const foundIndex =
    data?.length > 0
      ? iqamahTimings?.findIndex(
          e =>
            moment(e?.effectiveDate).format('YYYY-MM-DD') ==
            moment(new Date(new Date())).format('YYYY-MM-DD'),
        )
      : -1;

  const contentToRender = () => {
    return foundIndex! > -1 ? (
      <TimeTableCard
        onEdit={() => {
          console.log('item', iqamahTimings![foundIndex!]);

          selectedIqamah(iqamahTimings![foundIndex!]);
          setFlag('iEdit');
        }}
        date={data[foundIndex!]?.date}
        data={data[foundIndex!]?.data}
      />
    ) : loading ? null : (
      <MyText
        textStyle={{ textAlign: 'center', marginVertical: 10 }}
        text="Nothing to show yet!"
      />
    );
  };

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
          {contentToRender()}
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

const styles = StyleSheet.create({});
