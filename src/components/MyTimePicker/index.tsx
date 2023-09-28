import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import MyText from '../MyText';
import { convertTo12Hour } from '../../utils/functions';

export default function MyTimePicker({
  initialValue = '00:00',
  onTimeChanged = (e: any) => {},
}: {
  initialValue: string;
  onTimeChanged?: (e: any) => void;
}) {
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(initialValue);

  useEffect(() => {
    setTime(initialValue);
  }, [initialValue]);

  const onChange = (selectedDate: any) => {
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
        <DateTimePickerModal
          isVisible={show}
          mode="time"
          date={timeToday}
          onConfirm={onChange}
          onCancel={() => setShow(false)}
        />
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShow(!show)}
        style={[
          styles.contentCol,
          {
            borderWidth: 0.5,
            width: 155,
            borderColor: '#3E3E3E',
            borderRadius: 3,
            height: 40,
            justifyContent: 'center',
          },
        ]}>
        <MyText text={convertTo12Hour(time)} size={16} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  contentCol: { alignItems: 'center' },
});
