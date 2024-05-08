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
    time.search(':') != -1
      ? parseInt(convert12to24(hours, time.slice(time?.length - 2)) ?? 0)
      : parseInt(convert12to24('12', 'am') ?? 0),
    parseInt(minutes ?? 0),
  );

  function convert12to24(hours12: string, amPm: string) {
    let hours24 = parseInt(hours12, 10);

    if (amPm.toLowerCase() === 'pm' && hours24 !== 12) {
      hours24 += 12;
    } else if (amPm.toLowerCase() === 'am' && hours24 === 12) {
      hours24 = 0;
    }

    // Ensure the result is formatted with two digits
    const hours24Formatted = String(hours24).padStart(2, '0');

    return hours24Formatted;
  }

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
        <MyText text={time} size={16} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  contentCol: { alignItems: 'center' },
});
