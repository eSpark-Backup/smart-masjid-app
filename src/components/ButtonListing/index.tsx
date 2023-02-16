import React from 'react';
import { StyleSheet } from 'react-native';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { DeviceSvg, LockSvg, WifiSvg } from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import { Card } from '../../containers';
import GapView from '../GapView';
import MyDivider from '../MyDivider';
import MyText from '../MyText';

interface ListItem {
  rightChild?: JSX.Element;
  title: string;
  leftIcon?: JSX.Element;
  onPress?: () => void;
}

export default function ButtonListing({
  data = [],
}: {
  data: ListItem[];
}) {
  return (
    <Card radius={0} width={275}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          return <ListCard item={item} index={index} />;
        }}
        ItemSeparatorComponent={() => {
          return <MyDivider height={0.25} />;
        }}
      />
    </Card>
  );
}

const ListCard = ({ item, index }: { item: ListItem; index: number }) => {
  return (
    <TouchableOpacity
      onPress={item?.onPress}
      activeOpacity={0.9}
      key={`${item}-${index}`}
      style={styles.cardContainer}>
      {item.leftIcon && item?.leftIcon}
      {item.leftIcon && <GapView mode="horizontal" length={20} />}
      <MyText text={item?.title} size={16} />
      <GapView mode="horizontal" length={item.leftIcon ? 50 : WINDOW_WIDTH - 270} />
      {item.rightChild && item?.rightChild}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: { flexDirection: 'row', padding: 20 },
});
