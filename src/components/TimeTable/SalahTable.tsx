import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';

import { WINDOW_WIDTH } from '../../constants';
import { IPrayerTimeForPeriod } from '../../types';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import { SalahTimings } from '../../types/masjidControllerTypes';

const RowItem = ({
  item,
}: {
  item: { name: string; adhan: string; Iqama: string };
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={[styles.contentRow, { height: 40 }]}>
        <View style={styles.contentCol}>
          <MyText text={item.name} size={16} />
        </View>
        <View style={styles.contentCol}>
          <MyText
            text={moment(item.adhan, 'HH:mm:ss').format('h:mm A')}
            size={16}
          />
        </View>
        <View style={styles.contentCol}>
          <MyText
            text={moment(item.Iqama, 'HH:mm:ss').format('h:mm A')}
            size={16}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SalahTable({
  data,
  headings = ['Salah', 'Adhan', 'Iqama'],
}: {
  data: SalahTimings[];
  headings?: string[];
}) {
  const renderItem = useCallback(
    ({ item, index }: { item: IPrayerTimeForPeriod; index: number }) => {
      return (
        <View key={index} style={{ width: WINDOW_WIDTH - 50 }}>
          {moment(item.date).format('YYYY-MM-DD') ==
            moment().format('YYYY-MM-DD') &&
            item?.salah?.map((data, i) => (
              <RowItem
                key={index + Math.random() * 9999}
                item={{
                  name: data?.name,
                  adhan: data?.adhanTime?.toString(),
                  Iqama: data?.iqamaTime?.toString(),
                }}
              />
            ))}
        </View>
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {headings?.map(value => (
          <View key={value} style={styles.headerCol}>
            <MyText text={value} size={16} textStyle={{ fontWeight: '500' }} />
          </View>
        ))}
      </View>
      <GapView />
      <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
      <FlatList
        data={data}
        snapToInterval={WINDOW_WIDTH - 50}
        decelerationRate={0}
        pinchGestureEnabled={true}
        scrollEventThrottle={0}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(_, index) => `list_item${index}`}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        ListEmptyComponent={
          <MyText
            textStyle={{ textAlign: 'center', marginVertical: 10 }}
            text="Nothing to show"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F1F7F8',
    borderRadius: 12,
    width: WINDOW_WIDTH - 28,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerCol: { width: '30%', alignItems: 'center' },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editContentRow: {
    marginVertical: 5,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  contentCol: { width: '30%', alignItems: 'center' },
  contentIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
  },
  shadowContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowColor: 'grey',
    shadowRadius: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
