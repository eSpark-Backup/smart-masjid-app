import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { State, useHookstate } from '@hookstate/core';

import {
  DeleteMasjidJummahTiming,
  GetMasjidJummahTiming,
} from '../../../../../../api/masjidController';
import { PlusCircle } from '../../../../../../assets';
import {
  GapView,
  LogoutModal,
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
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';
import { GlobalProps } from '../../../../../../types';
import { globalStore } from '../../../../../../store/GlobalStates';

export default function JummaTimings({
  setFlag,
  contentOpacity,
  selectedJumma,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  selectedJumma?: (value: JummahTime) => void;
}) {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const jummahTimings: any = useHookstate(masjidStore.JummahTime).get();
  const userData = useHookstate(userStore.userData).get();
  const [data, setData] = useState<any>([]);
  const [currentData, setCurrentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    state.globalLoading.set(true);
    // setLoading(true);
    getAllJumuahTimings();
  }, []);

  const getAllJumuahTimings = () => {
    GetMasjidJummahTiming(userData?.masjid?.id.toString() as string).then(
      (jumuahTime: JummahTime[]) => {
        if (jumuahTime?.length > 0) {
          let jumuahData: any = [];
          jumuahTime?.map((item, index) => {
            let jumuahs: jumuahsData[] = [];
            let jumuah = Object.keys(item).filter(val =>
              val.includes('jumuah'),
            ) as Array<'jumuah1' | 'jumuah2' | 'jumuah3'>;
            jumuah?.map((jumuah: 'jumuah1' | 'jumuah2' | 'jumuah3') => {
              let data: jumuahsData;
              data = {
                name: jumuah.slice(0, 1).toUpperCase() + jumuah.slice(1),
                value: moment(
                  jumuahTime[index][`${jumuah}`],
                  'HH:mm:ss',
                ).format('LT'),
              };
              jumuahTime[index][`${jumuah}`] != null
                ? jumuahs.push(data)
                : null;
            });
            const namazData = {
              id: jumuahTime[index].id,
              date: jumuahTime[index].effectiveDate,
              data: jumuahs,
            };
            if (
              moment(namazData?.date).format('YYYY-MM-DD') <=
              moment().format('YYYY-MM-DD')
            ) {
              setCurrentData(namazData);
            } else if (
              moment(namazData?.date).format('YYYY-MM-DD') >
              moment().format('YYYY-MM-DD')
            ) {
              jumuahData.push(namazData);
            }
          });
          setData(jumuahData);
          state.globalLoading.set(false);
          // setLoading(false);
        } else state.globalLoading.set(false);
        // setLoading(false);
      },
    );
  };

  const deleteJumuahTime = async () => {
    setIsVisible(false);
    state.globalLoading.set(true);
    // setLoading(true);
    await DeleteMasjidJummahTiming(
      userData?.masjid?.id.toString() as string,
      deleteId as string,
    );
    getAllJumuahTimings();
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

  const contentToRender = () => {
    return !state.globalLoading.get() ? (
      currentData ? (
        <TimeTableCard
          showEdit={currentData?.date == moment().format('YYYY-MM-DD')}
          onEdit={() => {
            selectedJumma!(currentData);
            setFlag('jEdit');
          }}
          date={currentData?.date}
          data={currentData?.data}
        />
      ) : (
        <MyText
          textStyle={{ textAlign: 'center', marginVertical: 10 }}
          text="No current Jumuah to show yet!"
        />
      )
    ) : null;
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {/* <OverlayLoader isShow={loading} /> */}
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
        <GapView />
        <View style={{ paddingHorizontal: 15 }}>
          {/* <OverlayLoader isShow={loading} /> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingBottom: 5,
            }}>
            <MyTextSubHeader text="Current" />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setFlag('jAdd')}>
              <PlusCircle />
            </TouchableOpacity>
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
                showEdit={true}
                onEdit={() => {
                  selectedJumma!(item);
                  setFlag('jEdit');
                }}
                key={item.date}
                date={item.date}
                data={item.data}
                deleteBtn
                onDelete={() => {
                  setIsVisible(true);
                  setDeleteId(item.id);
                }}
              />
            )}
            ListEmptyComponent={
              state.globalLoading.get() ? null : (
                <MyText
                  textStyle={{ textAlign: 'center', marginVertical: 10 }}
                  text="No upcoming Jumuah to show yet!"
                />
              )
            }
          />
        </View>
        <LogoutModal
          message="Do you wish to delete?"
          visible={isVisible}
          onAllowed={deleteJumuahTime}
          onClose={() => {
            setIsVisible(!isVisible);
            console.log('Cancelled');
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
