import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  ViewToken,
} from 'react-native';
import {
  CheckMark,
  EditTimeTable,
  InfoCircle,
  MuteSvg,
  VolumUpGreen,
} from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import { IPrayerTimeForPeriod } from '../../types';
import { Rounded } from '../Buttons';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import MyTimePicker from '../MyTimePicker';
import TextLabel from '../TextLabel';

const RowItem = ({
  item,
  isMute,
}: {
  item: { name: string; adhan: string; iqamah: string };
  isMute: boolean;
}) => {
  const [toggleMute, setToggleMute] = useState(true);
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={[styles.contentRow, { marginVertical: 10 }]}>
        <View style={styles.contentCol}>
          <MyText text={item.name} size={16} />
        </View>
        <View style={styles.contentCol}>
          <MyText text={item.adhan} size={16} />
        </View>
        <View style={styles.contentCol}>
          <MyText text={item.iqamah} size={16} />
        </View>
        {isMute && (
          <View style={styles.contentIcon}>
            {toggleMute ? (
              <MuteSvg
                onPress={() => setToggleMute(!toggleMute)}
                height={16}
                width={16}
              />
            ) : (
              <VolumUpGreen
                onPress={() => setToggleMute(!toggleMute)}
                height={16}
                width={16}
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface ViewabilityConfigCallbackPair {
  viewabilityConfig: unknown;
  onViewableItemsChanged: ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => void;
}

export default function SwipeableTimeTable({
  data,
  isMute = false,
  isEdit = false,
  isInfo = false,
  headings = ['Salah', 'Adhan', 'Iqamah'],
  header = <></>,
  onSubmitEditing = () => {
    console.log('submit');
  },
  editView = false,
  footer = <></>,
}: {
  data: IPrayerTimeForPeriod[];
  isMute?: boolean;
  isEdit?: boolean;
  isInfo?: boolean;
  headings?: string[];
  header?: React.ReactNode;
  btnLabel?: string;
  onButtonPress?: () => void;
  onSubmitEditing?: () => void;
  editView?: boolean;
  footer?: React.ReactNode;
}) {
  const [currentItem, setCurrentItem] = useState<IPrayerTimeForPeriod | null>(
    data?.length > 0 ? data[0] : null,
  );
  const slider = useRef<FlatList>(null);

  const onViewRef = React.useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Use viewable items in state or as intended
      console.log('viewableItems', viewableItems);
      if (viewableItems.length > 0) {
        let index: any = viewableItems[0].index;
        console.log('data[index]', data[index].date, index);
        setCurrentItem(data[index]);
      }
    },
  );

  const renderItem = useCallback(
    ({ item, index }: { item: IPrayerTimeForPeriod; index: number }) => {
      return (
        <View key={index} style={{ width: WINDOW_WIDTH - 70 }}>
          <RowItem
            // key={`${index}-fajr`}
            item={{
              name: 'Fajr',
              adhan: `${item.fajr.hour}:${item.fajr.minute}`,
              iqamah: `${item.fajr.hour}:${item.fajr.minute}`,
            }}
            isMute={isMute}
          />
          <RowItem
            // key={`${index}-dhuhr`}
            item={{
              name: 'Dhuhr',
              adhan: `${item.dhuhr.hour}:${item.dhuhr.minute}`,
              iqamah: `${item.dhuhr.hour}:${item.dhuhr.minute}`,
            }}
            isMute={isMute}
          />
          <RowItem
            // key={`${index}-asr`}
            item={{
              name: 'Asr',
              adhan: `${item.asr.hour}:${item.asr.minute}`,
              iqamah: `${item.asr.hour}:${item.asr.minute}`,
            }}
            isMute={isMute}
          />
          <RowItem
            // key={`${index}-maghrib`}
            item={{
              name: 'Mugrib',
              adhan: `${item.maghrib.hour}:${item.maghrib.minute}`,
              iqamah: `${item.maghrib.hour}:${item.maghrib.minute}`,
            }}
            isMute={isMute}
          />
          <RowItem
            // key={`${index}-isha`}
            item={{
              name: 'Isha',
              adhan: `${item.isha.hour}:${item.isha.minute}`,
              iqamah: `${item.isha.hour}:${item.isha.minute}`,
            }}
            isMute={isMute}
          />
        </View>
      );
    },
    [],
  );

  const onDateChange = (e: Date) => {
    const currentIndex = data.findIndex((value: IPrayerTimeForPeriod) => {
      console.log('value.date', value.date, moment(e).format('YYYY-MM-DD'));
      return value.date == moment(e).format('YYYY-MM-DD');
    });
    console.log('currentIndex', currentIndex);

    if (currentIndex != -1) {
      slider.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MyDatePicker
            type="standard"
            currentDate={currentItem ? new Date(currentItem.date) : new Date()}
            onDateChange={onDateChange}
          />
        </View>
        <GapView />
      </>
      <View style={styles.headerRow}>
        {headings?.map(value => (
          <View key={value} style={styles.headerCol}>
            <TextLabel label={value} />
          </View>
        ))}
        {isMute && !isInfo && <View style={styles.headerIcon} />}
        {isEdit && !isInfo && <View style={styles.headerIcon} />}
        {isInfo && (
          <View style={styles.headerIcon}>
            <InfoCircle />
          </View>
        )}
      </View>
      <GapView />
      <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
      <GapView />
      <FlatList
        ref={slider}
        data={data}
        horizontal
        pagingEnabled
        snapToInterval={WINDOW_WIDTH - 70}
        decelerationRate="fast"
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        renderItem={renderItem}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />
      {footer && (
        <>
          <GapView />
          {footer}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 12,
    width: WINDOW_WIDTH - 45,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCol: { width: '30%', alignItems: 'center' },
  headerIcon: { width: '10%', alignItems: 'center' },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 10
    alignItems: 'center',
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
