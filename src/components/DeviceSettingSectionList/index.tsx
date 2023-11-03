import React, { useState } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  Caution,
  CheckSvg,
  Chevron_Right,
  DeleteSvg,
  EditLight,
  Restart,
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
  onDangerPress?: () => void;
  isEditable?: boolean;
  isEdit?: boolean;
  rightArrow?: boolean;
  danger?: boolean;
  charLength?: number;
  onDoneEdit?: (text: string | undefined) => void;
  isDelete?: boolean;
  onDelete?: () => void;
  isReset?: boolean;
  onReset?: () => void;
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
        renderSectionHeader={({ section: { title } }) => (
          <>
            <View style={{ alignItems: 'center' }}>
              <MyDivider />
            </View>
            <GapView length={10} />
            <MyText
              text={title ?? ''}
              size={16}
              textStyle={{
                //  fontWeight: '500',
                fontFamily: 'Roboto-Medium',
                color: '#3E3E3E',
              }}
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
          <View style={{ ...styles.cardContainer }}>
            <TouchableOpacity
              disabled={Boolean(!item?.onPress)}
              onPress={item?.onPress}
              style={styles.row}>
              <View style={styles.leftIcon}>{item?.icon}</View>
              <GapView mode="horizontal" length={15} />
              <View>
                <View>
                  <MyText text={item?.title} size={16} />
                  <GapView mode="horizontal" length={5} />
                  <MyText
                    text={
                      item?.danger && item.title == 'Battery'
                        ? item?.subtitle!!
                        : item?.subtitle!!
                    }
                    size={16}
                    textStyle={{
                      color:
                        item?.danger && item.title == 'Battery'
                          ? '#FF6464'
                          : '#6E6E6E',
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                item.isReset
                  ? item?.onReset
                  : item.isDelete
                  ? item.onDelete
                  : item.danger
                  ? item.onDangerPress
                  : item.isEditable
                  ? item.onEditPress
                  : undefined
              }>
              {item?.isReset && <Restart />}
              {item?.isDelete && <DeleteSvg />}
              {item?.rightArrow && <Chevron_Right />}
              {item?.isEditable && <EditLight />}
              {item?.danger && <Caution />}
            </TouchableOpacity>
          </View>
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
                  isMAccont
                  maxLength={item.title == 'Name' ? 25 : undefined}
                  placeholderColor="#CFCFCF"
                  placeholder={item.title}
                  onChangeText={(value: string) => setDName(value)}
                  value={item.subtitle}
                />
              </View>
            </Card>
            <TouchableOpacity
              style={{ marginHorizontal: 5 }}
              onPress={() => item.onDoneEdit?.(dName)}>
              <CheckSvg width={35} height={35} />
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
