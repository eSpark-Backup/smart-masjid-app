import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Caution, DeviceEdit, EditHeavy } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataItem {
  title?: string;
  data: DataProp[];
}

interface DataProp {
  title: string;
  subtitle?: string;
  icon: JSX.Element;
  onPress?: () => void;
  isEditable?: boolean;
  danger?: boolean;
}

export default function DeviceSettingSectionList({
  data,
}: {
  data: DataItem[];
}) {
  return (
    <View style={{ flex: 1 }}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={data ?? []}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => <SectionCard item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <>
            <View style={{ alignItems: 'center' }}>
              <MyDivider />
            </View>
            <GapView length={30} />
            <TextLabel label={title ?? ''} />
            <GapView length={20} />
          </>
        )}
      />
    </View>
  );
}

const SectionCard = ({ item }: { item: DataProp }) => {
  return (
    <>
      <GapView />
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <View style={styles.leftIcon}>{item?.icon}</View>
          <GapView mode="horizontal" />
          <View>
            <View>
              <MyText text={item?.title} />
              <GapView mode="horizontal" length={5} />
              <MyText
                text={
                  item?.danger
                    ? item?.subtitle!! + ' Battery Low'
                    : item?.subtitle!!
                }
                textStyle={{ color: item?.danger ? '#ff6464' : 'black' }}
              />
            </View>
          </View>
        </View>
        <View>
          {item?.isEditable && <EditHeavy />}
          {item?.danger && <Caution />}
        </View>
      </View>
      <GapView />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WINDOW_WIDTH / 1.1,
    alignSelf: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  leftIcon: { height: 20, width: 20, alignItems: 'center' },
});
