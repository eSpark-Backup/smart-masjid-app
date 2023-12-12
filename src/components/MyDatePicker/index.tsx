import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import II from 'react-native-vector-icons/Ionicons';
import { Theme, useTheme } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Calendar } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import MyTextSubHeader from '../MyTextSubHeader';

export default function MyDatePicker({
  onDateChange = (e: any) => {},
  type = 'box',
  currentDate = null,
  minimumDate = undefined,
  maximumDate = undefined,
  dateFormat,
  showLabel,
  disablePicker,
}: {
  disablePicker?: boolean;
  onDateChange?: (e: any) => void;
  type?: 'box' | 'standard';
  currentDate?: Date | null;
  minimumDate?: Date | undefined;
  maximumDate?: Date | undefined;
  showLabel?: boolean;
  dateFormat?: 'Monthly' | 'FullDate';
}) {
  const [date, setDate] = useState<any>(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const { colors }: Theme = useTheme();
  useEffect(() => {
    if (currentDate) setDate(currentDate);
  }, [currentDate]);

  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onDateChange(currentDate);
  };

  const nextDate = () => {
    const newDate =
      dateFormat == 'Monthly'
        ? // @ts-ignore
          new Date(moment(date).add(1, 'month'))
        : // @ts-ignore
          new Date(moment(date).add(1, 'day'));
    setDate(newDate);
    onDateChange(newDate);
  };

  const prevDate = () => {
    const newDate =
      dateFormat == 'Monthly'
        ? // @ts-ignore
          new Date(moment(date).subtract(1, 'month'))
        : // @ts-ignore
          new Date(moment(date).subtract(1, 'day'));
    setDate(newDate);
    onDateChange(newDate);
  };

  if (type == 'box') {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={disablePicker}
          onPress={() => setShow(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderRadius: 10,
            height: 50,
          }}>
          <View
            style={{
              position: 'absolute',
              top: -10,
              left: 15,
              backgroundColor: colors.background,
              paddingHorizontal: 5,
            }}>
            <MyText
              textStyle={{
                color: colors.primary,
              }}
              text={'Effective Date'}
            />
          </View>
          {show && (
            <DateTimePickerModal
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              isVisible={show}
              date={date}
              mode={'date'}
              is24Hour={true}
              onConfirm={onChange}
              onCancel={() => setShow(false)}
            />
          )}
          <MyText text={moment(date)?.format('MM/DD/YYYY')} />
          <GapView length={10} mode="horizontal" />
          <Calendar style={{ color: '#006870' }} />
        </TouchableOpacity>
      </>
    );
  } else {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {show && (
            <DateTimePickerModal
              isVisible={show}
              date={date}
              mode={'date'}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              is24Hour={true}
              onConfirm={onChange}
              onCancel={() => setShow(false)}
            />
          )}
          <TouchableOpacity
            disabled={!moment(date).isAfter(minimumDate)}
            onPress={prevDate}>
            <II
              color={
                moment(date).isAfter(minimumDate) ? colors.primary : '#bdbdbd'
              }
              name="md-chevron-back"
              size={24}
            />
          </TouchableOpacity>
          <GapView length={10} mode="horizontal" />
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={disablePicker}
            onPress={() => setShow(true)}>
            <MyTextSubHeader
              text={
                dateFormat == 'Monthly'
                  ? moment(date)?.format('MMM, YYYY')
                  : moment(date)?.format('MMM-DD, YYYY')
              }
            />
          </TouchableOpacity>
          <GapView length={10} mode="horizontal" />
          <TouchableOpacity
            disabled={!moment(date).isBefore(maximumDate)}
            onPress={nextDate}>
            <II
              color={
                moment(date).isBefore(maximumDate) ? colors.primary : '#bdbdbd'
              }
              name="md-chevron-forward"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
