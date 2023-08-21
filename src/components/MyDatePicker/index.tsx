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
import { Theme, useTheme } from '@react-navigation/native';

export default function MyDatePicker({
  onDateChange = (e: any) => {},
  type = 'box',
  currentDate = null,
  minimumDate = undefined,
  maximumDate = undefined,
  showLabel,
}: {
  onDateChange?: (e: any) => void;
  type?: 'box' | 'standard';
  currentDate?: Date | null;
  minimumDate?: Date | undefined;
  maximumDate?: Date | undefined;
  showLabel?: boolean;
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
            borderRadius: 10,
            height: 42,
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
          <MyText text={moment(date)?.format('DD/MM/YYYY')} />
          <GapView length={10} mode="horizontal" />
          <Calendar style={{ color: '#006870' }} />
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
          <II
            disabled={!moment(date).isAfter(minimumDate)}
            onPress={prevDate}
            color={
              moment(date).isAfter(minimumDate) ? colors.primary : '#bdbdbd'
            }
            name="md-chevron-back"
            size={24}
          />
          {/* <GapView length={10} mode="horizontal" />
          <Calendar /> */}
          <GapView length={10} mode="horizontal" />
          <MyText
            text={moment(date)?.format('MMM-DD, YYYY')}
            size={16}
            textStyle={{ fontWeight: '500' }}
          />
          <GapView length={10} mode="horizontal" />
          <II
            disabled={!moment(date).isBefore(maximumDate)}
            color={
              moment(date).isBefore(maximumDate) ? colors.primary : '#bdbdbd'
            }
            onPress={nextDate}
            name="md-chevron-forward"
            size={24}
          />
        </TouchableOpacity>
      </>
    );
  }
}
