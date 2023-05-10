import React from 'react';
import { StyleSheet, View, SectionList, TouchableOpacity } from 'react-native';

import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import { WINDOW_HEIGHT } from '../../constants';

interface DataItem {
  title?: string;
  icon?: JSX.Element;
  onIconPress?: () => void;
  data: {
    title: string;
    value?: string;
    icon: JSX.Element;
    onPress: () => void;
    hidden?: boolean;
  }[];
}

interface FooterItem {
  title: string;
  icon: JSX.Element;
  onPress: () => void;
}

export default function ProfileSectionlist({
  data,
  footerData,
  scroll,
}: {
  data: DataItem[];
  footerData?: FooterItem[];
  scroll?: boolean;
}) {
  return (
    <SectionList
      sections={data ?? []}
      scrollEnabled={scroll}
      contentContainerStyle={{ height: '100%' }}
      keyExtractor={(item, index) => item.title + index}
      renderItem={({ item, index }) => {
        if (!item.hidden) {
          return <SectionCard item={item} index={index} />;
        } else return <View />;
      }}
      ListFooterComponentStyle={{ position: 'absolute', bottom: 0 }}
      ListFooterComponent={
        <View>
          {footerData?.map((item, index) => {
            return <SectionCard item={item} index={index} />;
          })}
        </View>
      }
    />
  );
}

const SectionCard = ({ item, index }: { item: any; index: number }) => {
  return (
    <View style={{ ...styles.cartContainer }}>
      <TouchableOpacity
        key={index + item.title}
        activeOpacity={0.8}
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={item.onPress}>
        {item.icon}
        <GapView mode="horizontal" />
        <MyText text={item.title} textStyle={{ fontSize: 16 }} />
      </TouchableOpacity>
      {item.value && (
        <MyText
          text={item.value}
          textStyle={{ fontSize: 14, color: '#6E6E6E' }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#fff',
  },
});
