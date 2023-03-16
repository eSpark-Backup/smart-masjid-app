import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { CheckMark, EditTimeTable, MuteSvg } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import { Rounded } from '../Buttons';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import MyTimePicker from '../MyTimePicker';
import TextLabel from '../TextLabel';

interface DataProps {
  name?: string;
  azanTiming?: string;
  iqamahTiming?: string;
  khutbahTiming?: string;
}

const RowItem = ({ item, index, isEdit, isMute, onSubmitEditing }: any) => {
  const [edit, setEdit] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        if (isEdit) setEdit(!edit);
      }}
      activeOpacity={0.9}
      key={`${item?.name}-${index}`}
      style={!edit ? {} : styles.editContentRow}>
      {edit && (
        <>
          <MyDatePicker onDateChange={() => {}} />
          <GapView />
        </>
      )}
      <View style={styles.contentRow}>
        {Object.keys(item)?.map((key: any, index) => (
          <>
            {index != 0 && edit ? (
              <MyTimePicker initialValue={item[key]} />
            ) : (
              <View
                key={key}
                style={
                  isEdit
                    ? { ...styles.contentCol, borderWidth: 1 }
                    : styles.contentCol
                }>
                <MyText text={item[key]} size={16} />
              </View>
            )}
          </>
        ))}
        {isMute && (
          <View style={styles.contentIcon}>
            <MuteSvg />
          </View>
        )}
        {edit && (
          <View style={[styles.contentIcon, { width: '15%', left: 10 }]}>
            <CheckMark onPress={onSubmitEditing} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function TimeTable({
  data,
  isMute = false,
  isEdit = false,
  headings = ['Salah', 'Adhan', 'Iqamah'],
  header = <></>,
  btnLabel = undefined,
  onButtonPress,
  onSubmitEditing = () => {
    console.log('submit');
  },
}: {
  data: DataProps[];
  isMute?: boolean;
  isEdit?: boolean;
  headings?: string[];
  header?: React.ReactNode;
  btnLabel?: string;
  onButtonPress?: () => void;
  onSubmitEditing?: () => void;
}) {
  return (
    <View style={styles.container}>
      {header && (
        <>
          {header}
          <GapView />
        </>
      )}
      <View style={styles.headerRow}>
        {headings?.map(value => (
          <View key={value} style={styles.headerCol}>
            <TextLabel label={value} />
          </View>
        ))}
        {isMute && <View style={styles.headerIcon} />}
        {isEdit && <View style={styles.headerIcon} />}
      </View>
      <GapView />
      <MyDivider style={{ alignSelf: 'center', width: '99%' }} />
      {data?.map((item: any, index) => (
        <RowItem
          key={`${item}-${index}`}
          item={item}
          index={index}
          isEdit={isEdit}
          isMute={isMute}
          onSubmitEditing={onSubmitEditing}
        />
      ))}
      {btnLabel && (
        <View style={{ alignSelf: 'center', marginBottom: 20 }}>
          <GapView length={20} />
          <Rounded label={btnLabel} width={250} onPress={onButtonPress} />
        </View>
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
    marginVertical: 10,
  },
  editContentRow: {
    marginVertical: 10,
    backgroundColor: '#CFCFCF',
    borderRadius: 12,
    padding: 10,
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
