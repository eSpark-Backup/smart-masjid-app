import React from 'react';
import { StyleSheet, View, SectionList, TouchableOpacity } from 'react-native';

import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataItem {
  title?: string;
  icon?: JSX.Element;
  onIconPress?: () => void;
  data: {
    title: string;
    value?: string;
    icon: JSX.Element;
    onPress: () => void;
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
      keyExtractor={(item, index) => item.title + index}
      renderItem={({ item, index }) => (
        <SectionCard item={item} index={index} />
      )}
      renderSectionHeader={({ section: { title, icon, onIconPress } }) => (
        <View
          style={{
            ...styles.sectionHeader,
            justifyContent: icon ? 'space-between' : 'center',
          }}>
          {icon && <GapView mode="horizontal" length={19} />}
          <TextLabel label={title ?? ''} />
          {icon && (
            <TouchableOpacity activeOpacity={0.9} onPress={onIconPress}>
              {icon}
            </TouchableOpacity>
          )}
        </View>
      )}
      renderSectionFooter={({ section: { title } }) => {
        return (
          <View style={{ marginTop: 184 }}>
            {footerData?.map((item, index) => {
              return <SectionCard item={item} index={index} />;
            })}
          </View>
        );
      }}
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
  },
});
