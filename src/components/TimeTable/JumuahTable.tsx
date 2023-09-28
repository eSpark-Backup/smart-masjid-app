import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import {
  JummahTime,
  SubscriptionList,
} from '../../types/masjidControllerTypes';
import {
  addSubscription,
  removeSubscription,
} from '../../api/deviceController';
import { Device } from '../../types/deviceControllerTypes';

const RowItem = ({
  item,
  isMute = false,
  subscribed,
  subscriptionData,
  setSubscriptions,
}: {
  item: { name: string; khutba: string };
  isMute: boolean;
  subscribed?: boolean;
  subscriptionData?: SubscriptionList;
  setSubscriptions: (id: string, adhanName: string) => void;
}) => {
  const toggleSubscription = () => {
    setSubscriptions(
      subscriptionData?.id.toString() as string,
      item.name == 'Jumuah 1'
        ? 'JUMUAH_1'
        : item.name == 'Jumuah 2'
        ? 'JUMUAH_2'
        : 'JUMUAH_3',
    );
  };
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={[styles.contentRow, { height: 40 }]}>
        <View style={styles.contentCol}>
          <MyText text={item.name} size={16} />
        </View>
        <View style={styles.contentCol}>
          <MyText
            text={
              item.khutba
                ? moment(item.khutba, 'HH:mm:ss').format('h:mm A')
                : 'unknown'
            }
            size={16}
          />
        </View>
        {isMute ? (
          <View style={styles.contentIcon}>
            {subscribed ? (
              <VolumUpGreen
                onPress={toggleSubscription}
                height={16}
                width={16}
              />
            ) : (
              <MuteSvg onPress={toggleSubscription} height={16} width={16} />
            )}
          </View>
        ) : (
          <View style={styles.contentIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function JumuahTable({
  data = undefined,
  headings = ['Salah', 'Adhan', 'Iqama'],
  header = <></>,
  isMute = true,
  masjidSubscriptions,
  subscriptions,
  setSubscriptions,
  deviceInfo,
  setLoading,
}: {
  data?: JummahTime;
  headings?: string[];
  header?: React.ReactNode;
  isMute?: boolean;
  masjidSubscriptions?: SubscriptionList[];
  subscriptions?: SubscriptionList[];
  setSubscriptions?: (data: SubscriptionList[]) => void;
  deviceInfo?: Device;
  setLoading?: (val: boolean) => void;
}) {
  const updateSubscriptions = (id: string, adhanName: string) => {
    if (id) {
      setLoading!(true);
      removeSubscription(deviceInfo?.id.toString() as string, id).then(data => {
        setSubscriptions!(data.subscriptions);
        setLoading!(false);
      });
    } else {
      setLoading!(true);
      const adhanData = masjidSubscriptions?.find(
        item => item.subscriptionType.name == adhanName.toUpperCase(),
      );
      addSubscription(
        deviceInfo?.id.toString() as string,
        adhanData?.id.toString() as string,
      ).then(data => {
        setSubscriptions!(data.subscriptions);
        setLoading!(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {headings?.map(value => (
          <View key={value} style={styles.headerCol}>
            <MyText text={value} size={16} textStyle={{ fontWeight: '500' }} />
          </View>
        ))}
        <View style={styles.headerIcon}>
          {/* <Tooltip position="top" content="Any Content" iconColor={'#006870'} /> */}
        </View>
      </View>
      <GapView />
      <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
      <View style={{ width: WINDOW_WIDTH - 50 }}>
        {!data?.jumuah1 && !data?.jumuah2 && !data?.jumuah3 ? (
          <MyText
            textStyle={{ textAlign: 'center', marginVertical: 10 }}
            text="Nothing to show"
          />
        ) : null}
        {data?.jumuah1 ? (
          <RowItem
            item={{ name: 'Jumuah 1', khutba: data?.jumuah1 ?? '' }}
            isMute={isMute}
            subscribed={subscriptions?.some(
              item => item.subscriptionType.name == 'JUMUAH_1',
            )}
            setSubscriptions={updateSubscriptions}
            subscriptionData={subscriptions?.find(
              item => item.subscriptionType.name == 'JUMUAH_1',
            )}
          />
        ) : null}
        {data?.jumuah2 ? (
          <RowItem
            item={{ name: 'Jumuah 2', khutba: data?.jumuah2 ?? '' }}
            isMute={isMute}
            subscribed={subscriptions?.some(
              item => item.subscriptionType.name == 'JUMUAH_2',
            )}
            setSubscriptions={updateSubscriptions}
            subscriptionData={subscriptions?.find(
              item => item.subscriptionType.name == 'JUMUAH_2',
            )}
          />
        ) : null}
        {data?.jumuah3 ? (
          <RowItem
            item={{ name: 'Jumuah 3', khutba: data?.jumuah3 ?? '' }}
            isMute={isMute}
            subscribed={subscriptions?.some(
              item => item.subscriptionType.name == 'JUMUAH_3',
            )}
            setSubscriptions={updateSubscriptions}
            subscriptionData={subscriptions?.find(
              item => item.subscriptionType.name == 'JUMUAH_3',
            )}
          />
        ) : null}
      </View>
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
    alignItems: 'flex-start',
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
