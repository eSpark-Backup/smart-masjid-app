import moment from 'moment';
import React, { useState } from 'react';
import { View } from 'react-native';
import II from 'react-native-vector-icons/Ionicons';
import { Calendar } from '../../assets';
import GapView from '../GapView';
import TextLabel from '../TextLabel';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { TouchableOpacity } from 'react-native';

export default function MyDatePicker({
  onDateChange = (e: any) => {},
}: {
  onDateChange: (e: any) => void;
}) {
  const [date, setDate] = useState<any>(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

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
            is24Hour={true}
            onConfirm={onChange}
            onCancel={() => setShow(false)}
          />
        )}
        <II onPress={prevDate} name="md-chevron-back" size={24} />
        <GapView length={10} mode="horizontal" />
        <Calendar />
        <GapView length={10} mode="horizontal" />
        <TextLabel label={moment(date)?.format('MMM-DD, YYYY')} />
        <GapView length={10} mode="horizontal" />
        <II onPress={nextDate} name="md-chevron-forward" size={24} />
      </TouchableOpacity>
    </>
  );
}
