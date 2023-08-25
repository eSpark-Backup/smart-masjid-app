import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewToken,
} from 'react-native';
import { MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { IPrayerTimeForPeriod } from '../../types';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import Tooltip from '../Tooltip';
import { SalahTimings } from '../../types/masjidControllerTypes';

const RowItem = ({
  item,
  isMute,
}: {
  item: { name: string; adhan: string; Iqama: string };
  isMute: boolean;
}) => {
  const [toggleMute, setToggleMute] = useState(true);
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
  headings = ['Salah', 'Adhan', 'Iqama'],
  header = <></>,
  onSubmitEditing = () => {
    console.log('submit');
  },
  editView = false,
  footer = <></>,
}: {
  data: SalahTimings[];
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
      if (viewableItems.length > 0) {
        let index: any = viewableItems[0].index;
        setCurrentItem(data[index]);
      }
    },
  );

  const renderItem = useCallback(
    ({ item, index }: { item: IPrayerTimeForPeriod; index: number }) => {
      return (
        <View>
          <View key={index} style={{ width: WINDOW_WIDTH - 50 }}>
            {item.salah.map((data, i) => (
              <RowItem
                item={{
                  name: data?.name,
                  adhan: data?.adhanTime?.toString(),
                  Iqama: data?.iqamaTime?.toString(),
                }}
                isMute={isMute}
              />
            ))}
          </View>
        </View>
      );
    },
    [],
  );

  const onDateChange = (e: Date) => {
    const currentIndex = data.findIndex((value: IPrayerTimeForPeriod) => {
      return value.date == moment(e).format('YYYY-MM-DD');
    });

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
            minimumDate={moment().toDate()}
            maximumDate={moment().add(1, 'month').toDate()}
            type="standard"
            currentDate={currentItem ? new Date(currentItem.date) : new Date()}
            onDateChange={onDateChange}
          />
        </View>
        <GapView length={15} />
      </>
      <View style={styles.headerRow}>
        {headings?.map(value => (
          <View key={value} style={styles.headerCol}>
            <MyText text={value} size={16} textStyle={{ fontWeight: '500' }} />
          </View>
        ))}
        {isMute && !isInfo && <View style={styles.headerIcon} />}
        {isEdit && !isInfo && <View style={styles.headerIcon} />}
        {isInfo && (
          <View style={{ right: 10 }}>
            <Tooltip
              position="top"
              content="Lorem ips amet, consectetur adipiscing elit  Lorem ipsum dolor sit"
              iconColor={'#006870'}
            />
          </View>
        )}
      </View>
      <GapView />
      <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
      <FlatList
        ref={slider}
        data={data}
        horizontal
        pagingEnabled
        snapToInterval={WINDOW_WIDTH - 50}
        decelerationRate={0}
        pinchGestureEnabled={true}
        scrollEventThrottle={0}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        renderItem={renderItem}
        keyExtractor={(_, index) => `list_item${index}`}
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
  headerCol: { width: '30%', alignItems: 'flex-start' },
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
  contentCol: { width: '30%', alignItems: 'flex-start' },
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
