import { useHookstate } from '@hookstate/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GetMasjidJummahTiming } from '../../../../../../api/masjidController';
import {
  Clock,
  EditTimeTable,
  History,
  TimeCircleSvg,
} from '../../../../../../assets';
import {
  GapView,
  MyDivider,
  MyText,
  ProfileAvatar,
  Rounded,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { masjidStore } from '../../../../../../store/MasjidStore';

export default function JummaTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [edit, setEdit] = useState(false);
  const jummahTimings: any = useHookstate(masjidStore.JummahTime).get();

  useEffect(() => {
    GetMasjidJummahTiming('1');
  }, []);

  const data: any = {
    id: 0,
    changeDate: '2023-12-13',
    jumuah1: '06:15:00',
    jumuah2: '06:15:00',
    jumuah3: '06:15:00',
    createdBy: 'string',
    createdDate: '2023-04-13T05:57:10.833Z',
  };

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
        key !== 'changeDate' &&
        key !== 'createdBy' &&
        key !== 'createdDate'
      ) {
        // If the key is a valid jumuah timing, add it to the arr array as an object
        arr.push({ name: key, azanTiming: jummahTimings[key] });
      }
    });
  }

  return (
    <>
      <GapView length={30} />
      <View style={{ flex: 1, marginTop: 70 }}>
        <TimeTable
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
                    <MyText text="Change Date: 02-24-2023" />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <History onPress={() => setFlag('jHist')} />
                    <GapView mode="horizontal" length={20} />
                    <EditTimeTable onPress={() => setEdit(true)} />
                  </View>
                </View>
              ) : (
                <View>
                  <MyDatePicker onDateChange={() => {}} />
                  <GapView length={20} />
                </View>
              )}
            </>
          }
          headings={['Salah', 'Khutbah']}
          data={arr}
          editView={edit}
          footer={
            <>
              {edit && (
                <View style={{ alignSelf: 'center' }}>
                  <GapView />
                  <Rounded label="Save" onPress={() => setEdit(false)} />
                </View>
              )}
            </>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
