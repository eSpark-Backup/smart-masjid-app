import { TouchableOpacity, View } from 'react-native';
import React from 'react';

import { Card } from '../../containers';
import { Calendar, Delete, EditPencil } from '../../assets';
import GapView from '../GapView';
import MyText from '../MyText';
import MyDivider from '../MyDivider';
import { WINDOW_WIDTH } from '../../constants';

interface TimeTableData {
  name: string;
  value: string;
}

const TimeTableCard = ({
  data = [],
  date = '',
  deleteBtn,
  onEdit,
  onDelete,
}: {
  data: TimeTableData[];
  date: string;
  deleteBtn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Card width={WINDOW_WIDTH - 28}>
        <View style={{ padding: 10 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar style={{ color: '#6E6E6E' }} />
              <GapView length={5} />
              <MyText text={date} size={12} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {deleteBtn ? (
                <TouchableOpacity activeOpacity={0.5} onPress={onDelete}>
                  <Delete />
                </TouchableOpacity>
              ) : null}
              <GapView length={5} mode="horizontal" />
              <TouchableOpacity activeOpacity={0.5} onPress={onEdit}>
                <EditPencil />
              </TouchableOpacity>
            </View>
          </View>
          <GapView />
          <MyDivider width={WINDOW_WIDTH - 48} />
          <GapView />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: data.length > 3 ? 'space-between' : 'flex-start',
            }}>
            {data.map(v => {
              console.log('v me kia hai', v);

              return (
                <View
                  key={v.name}
                  style={{ marginRight: data.length > 3 ? 0 : 20 }}>
                  <MyText
                    textStyle={{ textTransform: 'capitalize' }}
                    text={v.name}
                  />
                  <GapView length={5} />
                  <MyText
                    size={12}
                    textStyle={{ color: '#6E6E6E' }}
                    text={v.value}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default TimeTableCard;
