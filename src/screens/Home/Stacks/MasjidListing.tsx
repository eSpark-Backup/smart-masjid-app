import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListEmptyComponent } from '..';
import { GapView, MasjidListCard, TextLabel } from '../../../components';

export default function MasjidListing({
  data,
  setStep = () => {},
}: {
  data: any;
  setStep: any;
}) {
  const navigation = useNavigation();

  return (
    <View>
      <View style={{ alignSelf: 'center' }}>
        <GapView length={40} />
        <TextLabel label="My Subscriptions" />
        <GapView length={20} />
      </View>
      <FlatList
        data={data}
        contentContainerStyle={{ paddingBottom: 210, paddingTop: 10 }}
        renderItem={({ index }) => (
          <MasjidListCard
            key={index}
            onPress={() => setStep(1)}
            masjidName="Masjid Ar - Rahman"
          />
        )}
        ItemSeparatorComponent={GapView}
        ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
      />
    </View>
  );
}
