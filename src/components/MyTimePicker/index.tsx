import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MyText from '../MyText';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function MyTimePicker({
  initialValue = '00:00',
  onTimeChanged = (e: any) => {},
}: {
  initialValue: string;
  onTimeChanged?: (e: any) => void;
}) {
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(initialValue);

  const onChange = (event: any, selectedDate: any) => {
    let time = selectedDate.toString().substring(16, 21);
    setShow(false);
    setTime(time);
    onTimeChanged(time);
  };

  const [hours, minutes] = time.split(':');
  const today = new Date();
  const timeToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    parseInt(hours ?? 0),
    parseInt(minutes ?? 0),
  );
  return (
    <>
      {show && (
        <DateTimePicker mode="time" value={timeToday} onChange={onChange} />
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShow(!show)}
        style={[
          styles.contentCol,
          {
            borderWidth: 0.5,
            width: '27.5%',
            left: 10,
            borderColor: '#3E3E3E',
            padding: 5,
          },
        ]}>
        <MyText text={time} size={16} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  contentCol: { width: '30%', alignItems: 'center' },
});
