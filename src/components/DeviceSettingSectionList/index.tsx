import React, { useState } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  Caution,
  CheckSvg,
  Chevron_Right,
  EditHeavy,
  EditLight,
} from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyInput from '../MyInput';
import MyText from '../MyText';

interface DataItem {
  title?: string;
  data: DataProp[];
}

interface DataProp {
  title: string;
  subtitle?: string;
  icon: JSX.Element;
  onPress?: () => void;
  onEditPress?: () => void;
  isEditable?: boolean;
  isEdit?: boolean;
  rightArrow?: boolean;
  danger?: boolean;
  onDoneEdit?: (text: string | undefined) => void;
}

export default function DeviceSettingSectionList({
  data,
}: {
  data: DataItem[];
}) {
  return (
    <View style={{ flex: 1 }}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={data ?? []}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => <SectionCard item={item} />}
        ListFooterComponent={() => <GapView length={100} />}
        renderSectionHeader={({ section: { title } }) => (
          <>
            <View style={{ alignItems: 'center' }}>
              <MyDivider />
            </View>
            <GapView length={10} />
            <MyText
              text={title ?? ''}
              size={16}
              textStyle={{ fontWeight: '500', color: '#3E3E3E' }}
            />
            <GapView length={10} />
          </>
        )}
      />
    </View>
  );
}

const SectionCard = ({ item }: { item: DataProp }) => {
  const [dName, setDName] = useState('');
  return (
    <>
      {!item.isEdit ? (
        <>
          <GapView />
          <TouchableOpacity
            disabled={Boolean(!item?.onPress)}
            onPress={item?.onPress}
            style={{ ...styles.cardContainer }}>
            <View style={styles.row}>
              <View style={styles.leftIcon}>{item?.icon}</View>
              <GapView mode="horizontal" length={15} />
              <View>
                <View>
                  <MyText text={item?.title} />
                  <GapView mode="horizontal" length={5} />
                  <MyText
                    text={
                      item?.danger && item.title == 'Battery'
                        ? item?.subtitle!! + ' Battery Low'
                        : item?.subtitle!!
                    }
                    textStyle={{
                      color:
                        item?.danger && item.title == 'Battery'
                          ? '#FF6464'
                          : '#6E6E6E',
                    }}
                  />
                </View>
              </View>
            </View>
            <View>
              {/* {item?.rightArrow && <Chevron_Right />} */}
              {item?.isEditable && <EditLight />}
              {item?.danger && <Caution />}
            </View>
          </TouchableOpacity>
          <GapView />
        </>
      ) : (
        <>
          <GapView />
          <View
            style={{
              width: WINDOW_WIDTH - 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <Card width={WINDOW_WIDTH - 90} backgroundColor="#ffffff">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GapView mode="horizontal" />
                {item.icon}
                <GapView mode="horizontal" />
                <MyInput
                  placeholderColor="#CFCFCF"
                  placeholder={item.title}
                  onChangeText={(value: string) => setDName(value)}
                  value={item.subtitle}
                />
              </View>
            </Card>
            <TouchableOpacity onPress={() => item.onDoneEdit?.(dName)}>
              <CheckSvg width={50} height={50} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WINDOW_WIDTH / 1.1,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  leftIcon: { height: 20, width: 20, alignItems: 'center' },
});
