import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
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
    <View style={{zIndex: -1, backgroundColor: 'red'}}>
      <ScrollView>
        <View style={{ alignSelf: 'center', top: 50 }}>
          <TextLabel label="Masjid Subscriptions" />
          <GapView length={50} />
        </View>
        <FlatList
        style={{top: 50}}
          data={data}
          contentContainerStyle={{ paddingBottom: 210, paddingTop: 15 }}
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
      </ScrollView>
    </View>
  );
}
