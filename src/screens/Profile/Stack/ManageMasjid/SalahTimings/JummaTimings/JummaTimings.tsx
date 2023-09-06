import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, FlatList } from 'react-native';
import moment from 'moment';
import { useHookstate } from '@hookstate/core';

import { GetMasjidJummahTiming } from '../../../../../../api/masjidController';
import { PlusCircle } from '../../../../../../assets';
import {
  GapView,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
} from '../../../../../../components';
import { masjidStore } from '../../../../../../store/MasjidStore';
import TimeTableCard from '../../../../../../components/TimeTableCard';
import {
  JummahTime,
  jumuahsData,
} from '../../../../../../types/masjidControllerTypes';

export default function JummaTimings({
  setFlag,
  contentOpacity,
  selectedJumma,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  selectedJumma?: (value: JummahTime) => void;
}) {
  const [edit, setEdit] = useState(false);
  const jummahTimings: any = useHookstate(masjidStore.JummahTime).get();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetMasjidJummahTiming('1', moment(new Date()).format('YYYY-MM-DD')).then(
      (jumuahTime: JummahTime) => {
        let jumuahData = [];
        let jumuahs: jumuahsData[] = [];
        let jumuah: Array<'jumuah1' | 'jumuah2' | 'jumuah3'> = Object.keys(
          jumuahTime,
        ).filter(val => val.includes('jumuah')) as Array<
          'jumuah1' | 'jumuah2' | 'jumuah3'
        >;

        jumuah.map((jumuah: 'jumuah1' | 'jumuah2' | 'jumuah3') => {
          let data: jumuahsData;
          data = {
            name: jumuah.slice(0, 1).toUpperCase() + jumuah.slice(1),
            value: moment(jumuahTime[`${jumuah}`], 'HH:mm:ss').format('LT'),
          };
          console.log('data', data);
          jumuahTime[`${jumuah}`] != null ? jumuahs.push(data) : null;
        });
        console.log('jumuahs', jumuahs);
        const namazData = {
          id: jumuahTime.id,
          date: jumuahTime.effectiveDate,
          data: jumuahs,
        };
        jumuahData.push(namazData);
        setData(jumuahData);
        setLoading(false);
      },
    );
  }, []);

  // Here we Convert the single object to an arrays of jumuah timings

  // Here we initialize an empty array to hold the extracted jumuah timings
  var arr: any = [];

  // Check if the jummahTimings object is not null or undefined
  if (jummahTimings) {
    // Get all the keys of the jummahTimings object
    const keys = Object.keys(jummahTimings);
    // Loop through each key
    keys.forEach(key => {
      // Check if the key is not one of the properties that we don't want to extract
      if (
        key !== 'id' &&
        key !== 'effectiveDate' &&
        key !== 'createdBy' &&
        key !== 'createdDate' &&
        jummahTimings[key] != null
      ) {
        // If the key is a valid jumuah timing, add it to the arr array as an object
        arr.push({
          name: key,
          azanTiming: moment(jummahTimings[key], 'HH:mm:ss').format('LT'),
          onChange: (value: any) => {
            setData({
              ...data,
              [key]: moment(value, 'hh:mm').format('HH:mm:ss'),
            });
          },
        });
      }
    });
  }

  const contentToRender = () => {
    return !loading ? (
      moment(data[0]?.date).format('YYYY-MM-DD') <=
      moment(new Date()).format('YYYY-MM-DD') ? (
        <TimeTableCard
          onEdit={() => {
            selectedJumma!(data[0]);
            setFlag('jEdit');
          }}
          date={data[0]?.date}
          data={data[0]?.data}
        />
      ) : (
        <MyText
          textStyle={{ textAlign: 'center', marginVertical: 10 }}
          text="Nothing to show yet!"
        />
      )
    ) : null;
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <OverlayLoader isShow={loading} />
        <View style={{ alignSelf: 'center', top: 110 }}>
          <Animated.View style={[{ opacity: contentOpacity }]}>
            <MyTitle text="Jumuah Timings" />
          </Animated.View>
          <GapView length={50} />
        </View>

        <View style={{ top: 110, paddingHorizontal: 15 }}>
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
              <PlusCircle onPress={() => setFlag('jAdd')} />
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
                  selectedJumma!(item);
                  setFlag('jEdit');
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
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
