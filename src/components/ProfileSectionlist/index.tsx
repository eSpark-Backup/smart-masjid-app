import React from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';

interface DataItem {
  title?: string;
  icon?: JSX.Element;
  onIconPress?: () => void;
  data: {
    title: string;
    value?: string;
    icon: JSX.Element;
    onPress?: () => void;
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
  containerStyle,
}: {
  data: DataItem[];
  footerData?: FooterItem[];
  scroll?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <SectionList
      sections={data ?? []}
      scrollEnabled={scroll}
      contentContainerStyle={containerStyle}
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
            return <SectionCard key={index} item={item} index={index} />;
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
      <GapView mode='horizontal' length={5} />
      {item.value && (
        <MyText
          text={item.value}
          textStyle={{ fontSize: 14, color: '#3E3E3E' }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flexDirection: 'row',
    padding: 10,
    // paddingVertical: 8,
    height: 44,
    justifyContent: 'space-between',
    width: WINDOW_WIDTH - 28,
    alignSelf: 'center'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#fff',
  },
});
