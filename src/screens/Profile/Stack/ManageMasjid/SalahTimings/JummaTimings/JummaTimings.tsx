import { useHookstate } from '@hookstate/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import {
  GetMasjidJummahTiming,
  UpdatedMasjidJummahTiming,
} from '../../../../../../api/masjidController';
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
  OverlayLoader,
  ProfileAvatar,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../../../../../components';
import MyDatePicker from '../../../../../../components/MyDatePicker';
import { masjidStore } from '../../../../../../store/MasjidStore';
import moment from 'moment';

export default function JummaTimings({
  setFlag,
  contentOpacity,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
}) {
  const [edit, setEdit] = useState(false);
  const jummahTimings: any = useHookstate(masjidStore.JummahTime).get();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // console.log(
  //   'Jummah Timings',
  //   moment(jummahTimings.jumuah1, 'HH:mm:ss').format('LT'),
  // );

  useEffect(() => {
    GetMasjidJummahTiming('1');
  }, []);

  const data1: any = {
    id: 0,
    effectiveDate: '2023-12-13',
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

  const onUpdate = async () => {
    console.log('data', data);
    setLoading(true);
    await UpdatedMasjidJummahTiming('1', data);
    setLoading(false);
    setEdit(false);
    setData(null);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <OverlayLoader isShow={loading} />
        <View style={{ alignSelf: 'center', top: 110 }}>
          <Animated.View style={[{ opacity: contentOpacity }]}>
            <TextLabel
              label="Jumuah Timings"
              textStyle={{ alignSelf: 'center' }}
            />
          </Animated.View>
          <GapView length={50} />
        </View>

        <View style={{top: 110}}>
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
                      <MyText
                        text={`Effective Date: ${jummahTimings?.effectiveDate}`}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <History onPress={() => setFlag('jHist')} />
                      <GapView mode="horizontal" length={20} />
                      <EditTimeTable
                        onPress={() => {
                          setEdit(true);
                          setData(jummahTimings ?? {});
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <MyDatePicker
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
            headings={['Salah', 'Khutbah']}
            data={arr}
            editView={edit}
            footer={
              <>
                {edit && (
                  <View style={{ alignSelf: 'center' }}>
                    <GapView />
                    <Rounded
                      label="Save"
                      onPress={() => {
                        onUpdate();
                      }}
                    />
                  </View>
                )}
              </>
            }
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
