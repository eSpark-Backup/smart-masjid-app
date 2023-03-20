import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Clock,
  EditTimeTable,
  History,
  TimeCircleSvg,
} from '../../../../../assets';
import {
  GapView,
  MyDivider,
  MyText,
  ProfileAvatar,
  Rounded,
  TimeTable,
} from '../../../../../components';
import MyDatePicker from '../../../../../components/MyDatePicker';

export default function JummaTimings({
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
                <MyDatePicker onDateChange={() => {}} />
                <GapView length={20} />
              </View>
            )}
          </>
        }
        headings={['Salah', 'Khutbah']}
        data={[
          { name: 'Jummah 1', azanTiming: '12:50' },
          { name: 'Jummah 1', azanTiming: '12:50' },
        ]}
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
