import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewToken,
  Text,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { CheckCircle, MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { IPrayerTimeForPeriod } from '../../types';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import Tooltip from '../Tooltip';
import {
  AdhanLog,
  SalahTimings,
  SubscriptionList,
} from '../../types/masjidControllerTypes';
import { Device } from '../../types/deviceControllerTypes';
import {
  addSubscription,
  removeSubscription,
  _checkDeviceTelemetry,
} from '../../api/deviceController';
import { useLayoutAnimation } from '../../utils';
import { Card } from '../../containers';

const RowItem = ({
  item,
  isMute,
  subscribed,
  subscriptionData,
  setSubscriptions,
  adhanCalled,
}: {
  item: { name: string; adhan: string; Iqama: string };
  isMute: boolean;
  subscribed?: boolean;
  subscriptionData?: SubscriptionList;
  setSubscriptions: (id: string, adhanName: string) => void;
  adhanCalled?: boolean;
}) => {
  const toggleSubscription = () => {
    setSubscriptions(subscriptionData?.id.toString() as string, item.name);
  };

  return (
    <View>
      <View style={[styles.contentRow, { paddingLeft: 5, height: 40 }]}>
        <View style={styles.contentCol}>
          <CheckCircle color={adhanCalled ? '#1DF126' : '#9E9F9F'} />
          <GapView mode="horizontal" length={5} />
          <MyText text={item.name} size={16} />
        </View>
        <View
          style={{
            width: '28%',
            alignItems: 'center',
          }}>
          <MyText
            text={
              moment(item.adhan, 'HH:mm:ss').format('h:mm A') == 'Invalid date'
                ? '-'
                : moment(item.adhan, 'HH:mm:ss').format('h:mm A')
            }
            size={16}
          />
        </View>
        <View
          style={{
            width: '32%',
            alignItems: 'center',
          }}>
          <MyText
            text={
              moment(item.Iqama, 'HH:mm:ss').format('h:mm A') == 'Invalid date'
                ? '6:21 AM'
                : moment(item.Iqama, 'HH:mm:ss').format('h:mm A')
            }
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
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={toggleSubscription}>
                <MuteSvg height={16} width={16} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

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
  deviceGetsOnline,
  loading,
  adhanLog,
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
  deviceGetsOnline?: () => void;
  loading?: boolean;
  adhanLog?: AdhanLog | null;
}) {
  const [currentItem, setCurrentItem] = useState<IPrayerTimeForPeriod | null>(
    data?.length > 0 ? data[0] : null,
  );
  const [currInd, setCurrInd] = useState(0);
  const slider = useRef<FlatList>(null);

  useEffect(() => {
    useLayoutAnimation(500);
  }, [loading]);

  const updateSubscriptions = async (id: string, adhanName: string) => {
    setLoading(true);
    const isValid = await _checkDeviceTelemetry(
      deviceInfo.id.toString(),
      false,
    );
    if (!isValid) {
      Toast.show({
        type: 'error',
        text2: 'Device is currently offline',
      });
      setLoading(false);
      return;
    } else if (isValid && deviceInfo.deviceTelemetry.status == 'Offline') {
      deviceGetsOnline!();
      Toast.show({
        type: 'success',
        text2: 'Device gets back online',
      });
    }
    if (id) {
      console.log('id', id);
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
      if (viewableItems?.length > 0) {
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

  const checkCalledAdhan = (adhanName: string) => {
    switch (adhanName) {
      case 'fajr':
        return adhanLog?.fajrCalled == 'Y' ? true : false;
      case 'dhuhr':
        return adhanLog?.dhuhrCalled == 'Y' ? true : false;
      case 'asr':
        return adhanLog?.asrCalled == 'Y' ? true : false;
      case 'maghrib':
        return adhanLog?.maghribCalled == 'Y' ? true : false;
      case 'isha':
        return adhanLog?.ishaCalled == 'Y' ? true : false;

      default:
        break;
    }
  };

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
              adhanCalled={checkCalledAdhan(data?.name.toLowerCase())}
            />
          ))}
          {/* {item?.salah?.map((data, i) =>
            data?.sunriseTime ? (
              <View key={i} style={[styles.contentRow, { height: 40 }]}>
                <View style={styles.contentCol}>
                  <MyText text={'Sunrise'} size={16} />
                </View>
                <View
                  style={{
                    width: '28%',
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={moment(data.sunriseTime, 'HH:mm:ss').format('h:mm A')}
                    size={16}
                  />
                </View>
                <View style={styles.contentCol}>
                  <MyText text={'Shurooq'} size={16} />
                </View>
                <View style={{ ...styles.contentIcon, width: undefined }}>
                  <MyText
                    text={moment(data.shurooqTime, 'HH:mm:ss').format('h:mm A')}
                    size={16}
                  />
                </View>
              </View>
            ) : null,
          )} */}
        </View>
      </View>
    );
  };

  const onDateChange = (e: Date) => {
    if (
      currInd < data?.length - 1 &&
      currInd > -1 &&
      data[currInd].date == moment(e).subtract(1, 'd').format('YYYY-MM-DD')
    ) {
      setCurrInd(currInd + 1);
      slider.current?.scrollToIndex({
        index: currInd + 1,
        animated: true,
      });
    } else if (
      currInd < data?.length &&
      currInd > -1 &&
      data[currInd].date == moment(e).add(1, 'd').format('YYYY-MM-DD')
    ) {
      setCurrInd(currInd - 1);
      slider.current?.scrollToIndex({
        index: currInd - 1,
        animated: true,
      });
    } else {
      const currentIndex = data.findIndex((value: IPrayerTimeForPeriod) => {
        return value.date == moment(e).format('YYYY-MM-DD');
      });
      if (currInd > -1 && currInd < data?.length - 1) {
        slider.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }
  };

  // const validateUpdatedTime = async (mins?: number): Promise<boolean> => {
  //   const res = await _checkDeviceTelemetry(deviceInfo.id.toString(), true);
  //   if (res) {
  //     const utcDateString = res.updatedTime; // get a date/time
  //     const timeNow = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // format the current time to the same format
  //     const utcTimeNow = moment.utc(timeNow);
  //     const differenceInMinutes = Math.abs(
  //       moment(utcDateString).diff(moment(utcTimeNow), 'minutes'),
  //     ); // check the difference in minutes: number
  //     console.log(
  //       'updatedTime:',
  //       utcDateString,
  //       '\n',
  //       'timeNow:',
  //       utcTimeNow,
  //       '\n',
  //       'Difference in Time:',
  //       differenceInMinutes,
  //     );
  //     return differenceInMinutes < mins! ?? 2 ? true : false; //* The time should be lesser then the value
  //   } else return false;
  // };

  return (
    <>
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
              maximumDate={moment().add(6, 'days').toDate()}
              type="standard"
              // currentDate={
              //   currentItem ? moment(currentItem.date).toDate() : new Date()
              // }
              onDateChange={onDateChange}
              disablePicker
            />
          </View>
          <GapView length={15} />
        </>
        <View style={styles.headerRow}>
          {headings?.map(value => (
            <View key={value} style={styles.headerCol}>
              <MyText
                text={value}
                size={16}
                textStyle={{
                  // fontWeight: '500',
                  fontFamily: 'Roboto-Medium',
                }}
              />
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
          scrollEnabled={false}
          pagingEnabled
          snapToInterval={WINDOW_WIDTH - 50}
          decelerationRate={0}
          pinchGestureEnabled={true}
          scrollEventThrottle={0}
          showsHorizontalScrollIndicator={false}
          // onViewableItemsChanged={onViewRef.current}
          renderItem={renderItem}
          keyExtractor={(_, index) => `list_item${index}`}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 80,
          }}
          ListEmptyComponent={
            loading && data?.length < 1 ? (
              <View
                style={{
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MyText
                  textStyle={{
                    textAlign: 'center',
                    marginVertical: 10,
                    width: WINDOW_WIDTH - 50,
                  }}
                  text="Fetching Salah timings..."
                />
              </View>
            ) : (
              <MyText
                textStyle={{
                  textAlign: 'center',
                  marginVertical: 10,
                  width: WINDOW_WIDTH - 50,
                }}
                text="No Salah timings to show"
              />
            )
          }
        />
      </View>
      <GapView length={15} />
      <Card style={{ padding: 5 }}>
        {data[currInd]?.salah ? (
          data[currInd]?.salah?.map((data, i) =>
            data?.sunriseTime ? (
              <View key={i} style={[styles.contentRow, { height: 40 }]}>
                <View style={styles.contentCol}>
                  <MyText text={'Sunrise'} size={16} />
                </View>
                <View
                  style={{
                    width: '28%',
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={moment(data.sunriseTime, 'HH:mm:ss').format('h:mm A')}
                    size={16}
                  />
                </View>
                <View style={styles.contentCol}>
                  <MyText text={'Shurooq'} size={16} />
                </View>
                <View style={{ ...styles.contentIcon, width: undefined }}>
                  <MyText
                    text={moment(data.shurooqTime, 'HH:mm:ss').format('h:mm A')}
                    size={16}
                  />
                </View>
              </View>
            ) : null,
          )
        ) : (
          <View style={{ height: 40 }} />
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: WINDOW_WIDTH - 28,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  contentCol: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '22%',
    alignItems: 'center',
  },
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
