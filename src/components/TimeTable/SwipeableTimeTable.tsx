import moment from 'moment';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewToken,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { IPrayerTimeForPeriod } from '../../types';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import Tooltip from '../Tooltip';
import {
  SalahTimings,
  SubscriptionList,
} from '../../types/masjidControllerTypes';
import { Device } from '../../types/deviceControllerTypes';
import {
  addSubscription,
  getDeviceSubscriptions,
  removeSubscription,
  _checkDeviceTelemetry,
} from '../../api/deviceController';

const RowItem = ({
  item,
  isMute,
  subscribed,
  subscriptionData,
  setSubscriptions,
}: {
  item: { name: string; adhan: string; Iqama: string };
  isMute: boolean;
  subscribed?: boolean;
  subscriptionData?: SubscriptionList;
  setSubscriptions: (id: string, adhanName: string) => void;
}) => {
  const toggleSubscription = () => {
    setSubscriptions(subscriptionData?.id.toString() as string, item.name);
  };

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
            {subscribed ? (
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={toggleSubscription}>
                <VolumUpGreen height={16} width={16} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={toggleSubscription}>
                <MuteSvg height={16} width={16} />
              </TouchableOpacity>
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
  subscriptions,
  setSubscriptions,
  masjidSubscriptions,
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
  deviceInfo,
  setLoading,
}: {
  data: SalahTimings[];
  subscriptions: SubscriptionList[];
  setSubscriptions: (data: SubscriptionList[]) => void;
  masjidSubscriptions: SubscriptionList[];
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
  deviceInfo: Device;
  setLoading: (val: boolean) => void;
}) {
  const [currentItem, setCurrentItem] = useState<IPrayerTimeForPeriod | null>(
    data?.length > 0 ? data[0] : null,
  );
  const slider = useRef<FlatList>(null);

  const updateSubscriptions = async (id: string, adhanName: string) => {
    const isValid = await validateUpdatedTime();
    if (!isValid) {
      Toast.show({
        type: 'error',
        text2: 'Device is currently offline',
      });
      return;
    }
    if (id) {
      console.log('id', id);
      setLoading(true);
      removeSubscription(deviceInfo?.id.toString(), id).then(data => {
        console.log('data', data);
        setSubscriptions(data.subscriptions);
        setLoading(false);
      });
    } else {
      setLoading(true);
      const adhanData = masjidSubscriptions.find(
        item => item.subscriptionType.name == adhanName.toUpperCase(),
      );
      addSubscription(
        deviceInfo?.id.toString(),
        adhanData?.id.toString() as string,
      ).then(data => {
        console.log('data', data);
        setSubscriptions(data.subscriptions);
        setLoading(false);
      });
    }
  };

  const onViewRef = React.useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Use viewable items in state or as intended
      if (viewableItems.length > 0) {
        let itemData: any = viewableItems[0].item;
        setCurrentItem(itemData);
      }
    },
  );

  const renderItem1 = useCallback(
    ({ item, index }: { item: IPrayerTimeForPeriod; index: number }) => {
      return (
        <View key={index}>
          <View style={{ width: WINDOW_WIDTH - 50 }}>
            {item.salah.map((data, i) => (
              <RowItem
                key={i}
                item={{
                  name: data?.name,
                  adhan: data?.adhanTime?.toString(),
                  Iqama: data?.iqamaTime?.toString(),
                }}
                isMute={isMute}
                subscribed={subscriptions?.some(
                  item =>
                    item.subscriptionType.name == data?.name.toUpperCase(),
                )}
                setSubscriptions={() => console.log('subscrive update')}
              />
            ))}
          </View>
        </View>
      );
    },
    [],
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: IPrayerTimeForPeriod;
    index: number;
  }) => {
    return (
      <View key={index}>
        <View style={{ width: WINDOW_WIDTH - 50 }}>
          {item?.salah?.map((data, i) => (
            <RowItem
              key={i}
              item={{
                name: data?.name,
                adhan: data?.adhanTime?.toString(),
                Iqama: data?.iqamaTime?.toString(),
              }}
              isMute={isMute}
              subscribed={subscriptions?.some(
                item => item.subscriptionType.name == data?.name.toUpperCase(),
              )}
              subscriptionData={subscriptions?.find(
                item => item.subscriptionType.name == data?.name.toUpperCase(),
              )}
              setSubscriptions={updateSubscriptions}
            />
          ))}
        </View>
      </View>
    );
  };

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

  const validateUpdatedTime = async (): Promise<boolean> => {
    const res = await _checkDeviceTelemetry(deviceInfo.id.toString(), true);
    if (res) {
      const utcDateString = res.updatedTime; // get a date/time
      const timeNow = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // format the current time to the same format
      const utcTimeNow = moment.utc(timeNow);
      const differenceInMinutes = Math.abs(
        moment(utcDateString).diff(moment(utcTimeNow), 'minutes'),
      ); // check the difference in minutes: number
      console.log(
        'updatedTime:',
        utcDateString,
        '\n',
        'timeNow:',
        utcTimeNow,
        '\n',
        'Difference in Time:',
        differenceInMinutes,
      );
      return differenceInMinutes < 2 ? true : false;
    } else return false;
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
              content="You can subscribe to Adhan here. Adhan will play on your device when called at your masjid."
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
          itemVisiblePercentThreshold: 80,
        }}
        ListEmptyComponent={
          <MyText
            textStyle={{
              textAlign: 'center',
              alignSelf: 'center',
              marginVertical: 10,
              width: WINDOW_WIDTH - 50,
            }}
            text="Nothing to show"
          />
        }
      />
      {/* {footer && (
        <>
          <GapView />
          {footer}
        </>
      )} */}
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
