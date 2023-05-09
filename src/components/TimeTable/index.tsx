import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  CheckMark,
  EditTimeTable,
  InfoCircle,
  MuteSvg,
  VolumUpGreen,
} from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import { Rounded } from '../Buttons';
import GapView from '../GapView';
import MyDatePicker from '../MyDatePicker';
import MyDivider from '../MyDivider';
import MyInput from '../MyInput';
import MyText from '../MyText';
import MyTimePicker from '../MyTimePicker';
import TextLabel from '../TextLabel';
import { TextInput } from 'react-native';

interface DataProps {
  name?: string;
  azanTiming?: string;
  iqamahTiming?: string;
  khutbahTiming?: string;
  onChange?: (value: any) => void;
}

const RowItem = ({
  item,
  index,
  isEdit,
  isMute,
  onSubmitEditing,
  edit = false,
  type,
}: any) => {
  const [toggleMute, setToggleMute] = useState(true);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      key={`${item?.name}-${index}`}
      style={
        !edit
          ? {}
          : [styles.editContentRow, { paddingHorizontal: type == 'D' ? 0 : 10 }]
      }>
      <View style={[styles.contentRow, { marginVertical: edit ? 0 : 10 }]}>
        {Object.keys(item)?.map((key: any, index) => {
          if (key == 'onChange') return;
          return (
            <React.Fragment key={index}>
              {index != 0 && edit ? (
                <>
                  {type == 'F' && item[key]?.search(':') != -1 ? (
                    <MyTimePicker
                      onTimeChanged={item?.onChange}
                      initialValue={item[key]}
                    />
                  ) : (
                    <View
                      style={[
                        styles.contentCol,
                        { flexDirection: 'row', width: 80 },
                      ]}>
                      <TextInput
                        defaultValue={item[key]}
                        onChangeText={item?.onChange}
                        style={{
                          borderWidth: 0.5,
                          borderColor: '#3E3E3E',
                          borderRadius: 5,
                          height: 40,
                          width: 40,
                          textAlign: 'center',
                        }}
                      />
                      <GapView mode="horizontal" />
                      <MyText text="Mins" />
                    </View>
                  )}
                </>
              ) : (
                <View key={key} style={styles.contentCol}>
                  <MyText text={item[key]} size={16} />
                </View>
              )}
            </React.Fragment>
          );
        })}
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

export default function TimeTable({
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
  type = 'F',
}: {
  data: DataProps[];
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
  type?: 'F' | 'D';
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
            <MyText text={value} size={16} textStyle={{ fontWeight: '700' }} />
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
      {data?.map((item: any, index) => (
        <RowItem
          key={`${index}`}
          item={item}
          index={index}
          isEdit={isEdit}
          isMute={isMute}
          onSubmitEditing={onSubmitEditing}
          edit={editView}
          type={type}
        />
      ))}
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
    width: WINDOW_WIDTH - 28,
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
