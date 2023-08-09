import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { MuteSvg, VolumUpGreen } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import moment from 'moment';

const RowItem = ({
  item,
  isMute,
}: {
  item: { name: string; khutba: string };
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
        ) : (
          <View style={styles.contentIcon}/>
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
}: {
  data?: {
    id: number;
    effectiveDate: string;
    jumuah1?: string | null;
    jumuah2?: string | null;
    jumuah3?: string | null;
    createdBy: string;
    createdDate: string;
  };
  headings?: string[];
  header?: React.ReactNode;
  isMute?: boolean;
}) {
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
        <RowItem
          item={{ name: 'Jumuah 1', khutba: data?.jumuah1 ?? '' }}
          isMute={isMute}
        />
        <RowItem
          item={{ name: 'Jumuah 2', khutba: data?.jumuah2 ?? '' }}
          isMute={isMute}
        />
        <RowItem
          item={{ name: 'Jumuah 3', khutba: data?.jumuah3 ?? '' }}
          isMute={isMute}
        />
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
