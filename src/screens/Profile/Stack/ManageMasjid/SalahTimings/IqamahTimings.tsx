import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EditTimeTable, History } from '../../../../../assets';

import {
  GapView,
  MyDivider,
  MyDropDown,
  MyText,
  ProfileAvatar,
  Rounded,
  TimeTable,
} from '../../../../../components';
import MyDatePicker from '../../../../../components/MyDatePicker';
import { WINDOW_WIDTH } from '../../../../../constants';

export default function IqamahTimings({
  setFlag,
}: {
  setFlag: (value: string) => void;
}) {
  const [edit, setEdit] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ProfileAvatar />
      <GapView length={20} />
      <TimeTable
        header={
          <>
            <GapView />
            {!edit ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                }}>
                <View>
                  <MyText text="Change Date: 02-24-2023" />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <History />
                  <GapView mode="horizontal" length={20} />
                  <EditTimeTable onPress={() => setEdit(true)} />
                </View>
              </View>
            ) : (
              <View>
                <MyDropDown
                  title={''}
                  placeholder="Select Iqama Type"
                  items={[
                    { id: 1, name: 'type 1' },
                    { id: 2, name: 'type 2' },
                  ]}
                  width={WINDOW_WIDTH - 65}
                />
                <GapView />
                <MyDatePicker onDateChange={() => {}} />
                <GapView length={20} />
              </View>
            )}
          </>
        }
        data={[
          { name: 'Fajr', iqamahTiming: '6:00' },
          { name: 'Dhur', iqamahTiming: '1:30' },
          { name: 'Asr', iqamahTiming: '4:10' },
          { name: 'Mugrib', iqamahTiming: '5:50' },
          { name: 'Isha', iqamahTiming: '8:15' },
        ]}
        headings={['Salah', 'Iqamah']}
        editView={edit}
        footer={
          <>
            {edit && (
              <View style={{ alignSelf: 'center' }}>
                <GapView />
                <Rounded label="Save" onPress={() => setEdit(false)} />
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
