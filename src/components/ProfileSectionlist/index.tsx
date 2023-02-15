import React from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import GapView from '../GapView';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

interface DataItem {
  title?: string;
  icon?: JSX.Element;
  onIconPress?: () => void;
  data: {
    title: string;
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
}: {
  data: DataItem[];
  footerData?: FooterItem[];
}) {
  return (
    <SectionList
      sections={data ?? []}
      keyExtractor={(item, index) => item.title + index}
      renderItem={({ item }) => <SectionCard item={item} />}
      renderSectionHeader={({ section: { title, icon, onIconPress } }) => (
        <View style={styles.sectionHeader}>
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
            {footerData?.map(item => {
              return <SectionCard item={item} />;
            })}
          </View>
        );
      }}
    />
  );
}

const SectionCard = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.cartContainer}>
      {item.icon}
      <GapView mode="horizontal" />
      <MyText text={item.title} textStyle={{ fontSize: 16 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});
