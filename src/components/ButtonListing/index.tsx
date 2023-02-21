import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { DeviceSvg, LockSvg, WifiSvg } from '../../assets';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
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

export default function ButtonListing({ data = [] }: { data: ListItem[] }) {
  return (
    <Card radius={0} width={275} height={200}>
      <FlatList
        style={{maxHeight: 200}}
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
  const theme: Theme = useTheme()
  const styles = makeStyles(theme, item)

  return (
    <TouchableOpacity
      onPress={item?.onPress}
      activeOpacity={0.9}
      key={`${item}-${index}`}
      style={styles.cardContainer}>
      {item.leftIcon && item?.leftIcon}
      {item.leftIcon && <GapView mode="horizontal" length={15} />}
      <MyText text={item?.title} size={16} />
      <GapView
        mode="horizontal"
        length={item.leftIcon ? 50 : WINDOW_WIDTH / 8.5}
      />
      <View style={{flexDirection: 'row'}}>
        {item.rightChild && item?.rightChild}
      </View>
    </TouchableOpacity>
  );
};


const makeStyles = (theme: Theme, props: ListItem) => {
  const { colors } = theme;
  const { rightChild } = props
  return StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      padding: 20,
      alignItems: 'center',
      justifyContent: !rightChild ? 'flex-start' : 'space-between'
    },
  })
}
