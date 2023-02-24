import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { EditTimeTable, MuteSvg } from '../../assets';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataProps {
  name: string;
  azanTiming: string;
  iqamahTiming: string;
}

export default function TimeTable({
  data,
  isMute = false,
  isEdit = false,
}: {
  data: DataProps[];
  isMute?: boolean;
  isEdit?: boolean;
}) {
  return (
    <Card>
      <View style={{ padding: 15 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '25%' }}>
            <TextLabel label="Salah" />
          </View>
          <View style={{ width: '25%' }}>
            <TextLabel label="Adhan" />
          </View>
          <View style={{ width: '25%' }}>
            <TextLabel label="Iqamah" />
          </View>
          {isMute && <View style={{ width: '25%' }} />}
          {isEdit && <View style={{ width: '25%' }} />}
        </View>
        <GapView />
        <MyDivider style={{ alignSelf: 'center', width: '99%' }} />

        {data?.map((item, index) => {
          return (
            <View
              key={`${item?.name}-${index}`}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <View style={{ width: '25%' }}>
                <MyText text={item.name} size={16} />
              </View>
              <View style={{ width: '25%' }}>
                <MyText text={item.azanTiming} size={16} />
              </View>
              <View style={{ width: '25%' }}>
                <MyText text={item.iqamahTiming} size={16} />
              </View>
              {isEdit && <EditTimeTable style={{ width: '25%' }} />}
              {isMute && <MuteSvg style={{ width: '25%' }} />}
            </View>
          );
        })}
      </View>
    </Card>
  );
}
