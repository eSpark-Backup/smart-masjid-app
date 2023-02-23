import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { DeviceEdit } from '../../assets';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataItem {
  title?: string;
  data: {
    title: string;
    subtitle?: string;
    icon: JSX.Element;
    onPress?: () => void;
    isEditable?: boolean;
  }[];
}

export default function DeviceSettingSectionList({
  data,
}: {
  data: DataItem[];
}) {
  return (
    <View>
      <SectionList
        contentContainerStyle={{ padding: 15 }}
        sections={data ?? []}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => <SectionCard item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <TextLabel label={title ?? ''} />
            <GapView />
          </View>
        )}
        SectionSeparatorComponent={MyDivider}
      />
    </View>
  );
}

const SectionCard = ({ item }: { item: any }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>{item?.icon}</View>
        <GapView mode="horizontal" />
        <View>
          <View>
            <MyText text={item?.title} />
            <GapView mode="horizontal" length={5} />
            <MyText text={item?.subtitle} />
          </View>
        </View>
      </View>
      <View>{item?.isEditable && <DeviceEdit />}</View>
    </View>
  );
};
