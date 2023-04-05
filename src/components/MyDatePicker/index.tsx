import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import II from 'react-native-vector-icons/Ionicons';
import { Calendar } from '../../assets';
import GapView from '../GapView';
import TextLabel from '../TextLabel';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { TouchableOpacity } from 'react-native';
import MyText from '../MyText';

export default function MyDatePicker({
  onDateChange = (e: any) => {},
  type = 'box',
  currentDate = new Date(),
  minimumDate = undefined,
  maximumDate = undefined,
}: {
  onDateChange: (e: any) => void;
  type?: 'box' | 'standard';
  currentDate?: Date;
  minimumDate?: Date | undefined;
  maximumDate?: Date | undefined;
}) {
  const [date, setDate] = useState<any>(currentDate);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onDateChange(currentDate);
  };

  const nextDate = () => {
    // @ts-ignore
    const newDate = new Date(moment(date).add(1, 'day'));
    setDate(newDate);
    onDateChange(newDate);
  };

  const prevDate = () => {
    // @ts-ignore
    const newDate = new Date(moment(date).subtract(1, 'day'));
    setDate(newDate);
    onDateChange(newDate);
  };

  if (type == 'box') {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShow(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderRadius: 12,
            height: 38,
          }}>
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
          <MyText text={moment(date)?.format('DD/MM/YYYY')} />
          <GapView length={10} mode="horizontal" />
          <Calendar />
        </TouchableOpacity>
      </>
    );
  } else {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShow(true)}
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
          {moment(date).isAfter(minimumDate) && (
            <II onPress={prevDate} name="md-chevron-back" size={24} />
          )}
          <GapView length={10} mode="horizontal" />
          <Calendar />
          <GapView length={10} mode="horizontal" />
          <TextLabel label={moment(date)?.format('MMM-DD, YYYY')} />
          <GapView length={10} mode="horizontal" />
          {moment(date).isBefore(maximumDate) && (
            <II onPress={nextDate} name="md-chevron-forward" size={24} />
          )}
        </TouchableOpacity>
      </>
    );
  }
}
