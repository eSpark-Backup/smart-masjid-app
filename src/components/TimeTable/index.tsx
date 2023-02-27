import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckMark, EditTimeTable, MuteSvg } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataProps {
  name?: string;
  azanTiming?: string;
  iqamahTiming?: string;
  khutbahTiming?: string;
}

const RowItem = ({ item, index, isEdit, isMute }: any) => {
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
          <MyDatePicker />
          <GapView />
        </>
      )}
      <View style={styles.contentRow}>
        {Object.keys(item)?.map((key: any) => (
          <View key={key} style={styles.contentCol}>
            <MyText text={item[key]} size={16} />
          </View>
        ))}
        {(!edit && isEdit) && (
          <View style={styles.contentIcon}>
            <EditTimeTable />
          </View>
        )}
        {isMute && (
          <View style={styles.contentIcon}>
            <MuteSvg />
          </View>
        )}
        {edit && (
          <View style={styles.contentIcon}>
            <CheckMark />
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
}: {
  data: DataProps[];
  isMute?: boolean;
  isEdit?: boolean;
  headings?: string[];
  header?: React.ReactNode;
}) {
  return (
    <Card>
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
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10},
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
  },
  contentCol: { width: '30%', alignItems: 'center' },
  contentIcon: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
