import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useHookstate } from '@hookstate/core';
import moment from 'moment';

import {
  DeleteMasjidIqamahTiming,
  GetMasjidIqamahTiming,
} from '../../../../../../api/masjidController';
import { HistoryBox, PlusCircle } from '../../../../../../assets';
import {
  GapView,
  LogoutModal,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
} from '../../../../../../components';

import { masjidStore } from '../../../../../../store/MasjidStore';
import { IqamahTime } from '../../../../../../types/masjidControllerTypes';
import TimeTableCard from '../../../../../../components/TimeTableCard';
import { userStore } from '../../../../../../store/UserStore';
import { WINDOW_WIDTH } from '../../../../../../constants';

export default function IqamahTimings({
  setFlag,
  contentOpacity = 0,
  selectedIqamah,
}: {
  setFlag: (value: string) => void;
  contentOpacity?: any;
  selectedIqamah: (value: IqamahTime) => void;
}) {
  const userData = useHookstate(userStore.userData).get();
  const iqamahTimings = useHookstate(masjidStore.iqamahTime).get();
  const [currentData, setCurrentData] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllIqamahTimings();
  }, []);

  const getAllIqamahTimings = () => {
    GetMasjidIqamahTiming(userData?.masjid.id.toString() as string).then(
      iqamahTime => {
        let iqamahData: any = [];
        iqamahTime?.map((i: IqamahTime) => {
          if (
            moment(i?.effectiveDate).format('YYYY-MM-DD') <=
            moment(new Date(new Date())).format('YYYY-MM-DD')
          ) {
            const namazData = {
              id: i.id,
              date: i.effectiveDate,
              data: [
                {
                  name: 'fajr',
                  value:
                    i.type == 'D'
                      ? '+' + i.fajrDelay + ' mins'
                      : moment(i?.fajr, 'HH:mm:ss').format('LT'),
                },
                {
                  name: 'dhuhr',
                  value:
                    i.type == 'D'
                      ? '+' + i.dhuhrDelay + ' mins'
                      : moment(i?.dhuhr, 'HH:mm:ss').format('LT'),
                },
                {
                  name: 'asr',
                  value:
                    i.type == 'D'
                      ? '+' + i.asrDelay + ' mins'
                      : moment(i?.asr, 'HH:mm:ss').format('LT'),
                },
                { name: 'maghrib', value: '+' + i.maghribDelay + ' mins' },
                {
                  name: 'isha',
                  value:
                    i.type == 'D'
                      ? '+' + i.ishaDelay + ' mins'
                      : moment(i?.isha, 'HH:mm:ss').format('LT'),
                },
              ],
              type: i.type,
            };
            setCurrentData(namazData);
            return;
          }
          const namazData = {
            id: i.id,
            date: i.effectiveDate,
            data: [
              {
                name: 'fajr',
                value:
                  i.type == 'D'
                    ? '+' + i.fajrDelay + ' mins'
                    : moment(i?.fajr, 'HH:mm:ss').format('LT'),
              },
              {
                name: 'dhuhr',
                value:
                  i.type == 'D'
                    ? '+' + i.dhuhrDelay + ' mins'
                    : moment(i?.dhuhr, 'HH:mm:ss').format('LT'),
              },
              {
                name: 'asr',
                value:
                  i.type == 'D'
                    ? '+' + i.asrDelay + ' mins'
                    : moment(i?.asr, 'HH:mm:ss').format('LT'),
              },
              { name: 'maghrib', value: '+' + i.maghribDelay + ' mins' },
              {
                name: 'isha',
                value:
                  i.type == 'D'
                    ? '+' + i.ishaDelay + ' mins'
                    : moment(i?.isha, 'HH:mm:ss').format('LT'),
              },
            ],
            type: i.type,
          };
          iqamahData.push(namazData);
        });
        setData(iqamahData);
        setLoading(false);
      },
    );
  };

  const contentToRender = () => {
    return currentData != null ? (
      <TimeTableCard date={currentData?.date} data={currentData?.data} />
    ) : loading ? null : (
      <MyText
        textStyle={{ textAlign: 'center', marginVertical: 10 }}
        text="No current Iqama to show yet!"
      />
    );
  };

  const deleteIqamahTime = async () => {
    setIsVisible(false);
    setLoading(true);
    await DeleteMasjidIqamahTiming(
      userData?.masjid.id.toString() as string,
      deleteId as string,
    );
    getAllIqamahTimings();
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
            <MyTitle text="Iqama Timings" />
          </Animated.View>
        </View>
        <GapView />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
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
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setFlag('iAdd')}>
                <PlusCircle />
              </TouchableOpacity>
              <GapView mode="horizontal" />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setFlag('iHist')}>
                <HistoryBox />
              </TouchableOpacity>
            </View>
          </View>
          {contentToRender()}
          <View
            style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5 }}>
            <MyTextSubHeader text="Upcoming" />
          </View>
          {loading ? null : (
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <TimeTableCard
                  onEdit={() => {
                    const ind = iqamahTimings?.findIndex(e => e.id == item.id);
                    selectedIqamah(iqamahTimings![ind!]);
                    setFlag('iEdit');
                  }}
                  key={item.id}
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
                <MyText
                  textStyle={{ textAlign: 'center', marginVertical: 10 }}
                  text="No upcoming Iqama to show yet!"
                />
              }
            />
          )}
        </ScrollView>
        <LogoutModal
          message="Do you wish to delete?"
          visible={isVisible}
          onAllowed={deleteIqamahTime}
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
