import React from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import GapView from '../GapView';
import MyText from '../MyText';
import { WINDOW_WIDTH } from '../../constants';

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
  itemStyle,
}: {
  data: DataItem[];
  footerData?: FooterItem[];
  scroll?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <SectionList
      sections={data ?? []}
      scrollEnabled={scroll}
      contentContainerStyle={containerStyle}
      keyExtractor={(item, index) => item.title + index}
      renderItem={({ item, index }) => {
        if (!item.hidden) {
          return (
            <SectionCard cardStyle={itemStyle} item={item} index={index} />
          );
        } else return <View />;
      }}
      ListFooterComponentStyle={{
        position: 'absolute',
        bottom: 0,
        left: 15,
      }}
      ListFooterComponent={
        <View>
          {footerData?.map((item, index) => {
            return (
              <SectionCard
                key={index}
                cardTextStyle={{ color: '#006870' }}
                item={item}
                index={index}
              />
            );
          })}
        </View>
      }
    />
  );
}

const SectionCard = ({
  item,
  index,
  cardStyle,
  cardTextStyle,
}: {
  item: any;
  index: number;
  cardStyle?: StyleProp<ViewStyle>;
  cardTextStyle?: TextStyle;
}) => {
  return (
    <View style={[{ ...styles.cartContainer }, cardStyle]}>
      <TouchableOpacity
        key={index + item.title}
        activeOpacity={0.8}
        style={{
          width: '95%',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={item.onPress}>
        {item.icon}
        <GapView mode="horizontal" />
        <MyText text={item.title} size={16} textStyle={cardTextStyle} />
      </TouchableOpacity>
      <GapView mode="horizontal" length={5} />
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
    justifyContent: 'space-between',
    width: WINDOW_WIDTH - 28,
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
});
