import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ListEmptyComponent } from '..';
import { GapView, MasjidListCard } from '../../../components';

export default function MasjidListing({ data, setStep = () => {} }: { data: any, setStep: any }) {
  const navigation = useNavigation();

  return (
    <FlatList
      data={data}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      renderItem={() => <MasjidListCard onPress={() => setStep(1)} masjidName="Masjid Ar - Rahman" />}
      ItemSeparatorComponent={GapView}
      ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
    />
  );
}
