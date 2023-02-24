import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { SearchMasjidSvg } from '../../assets';
import { GapView, MasjidListCard, MyText, Rounded } from '../../components';
import { Wrapper } from '../../containers';
import { BottomNavigationParamList } from '../../types';

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

const ListEmptyComponent = ({
  navigation,
}: {
  navigation: HomeNavigationProps['navigation'];
}) => {
  return (
    <ScrollView>
      <View style={{ alignItems: 'center' }}>
        <GapView length={30} />
        <MyText
          text={`You have not subscribes to a\nmasjid yet`}
          textStyle={{ textAlign: 'center', fontSize: 16 }}
        />
        <GapView length={30} />
        <SearchMasjidSvg />
        <GapView length={30} />
        <MyText
          text={`Search for a masjid near you`}
          textStyle={{ textAlign: 'center', fontSize: 16 }}
        />
        <GapView />
        <Rounded onPress={() => navigation.navigate('Search')} label="Search" />
      </View>
    </ScrollView>
  );
};

export default function Home() {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  // const data = Array(10).fill(1)
  const data: any = [];
  return (
    <Wrapper showFooter={false}>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        renderItem={() => (
          <MasjidListCard masjidName="Masjid Ar - Rahman" />
        )}
        ItemSeparatorComponent={GapView}
        ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
      />
    </Wrapper>
  );
}
