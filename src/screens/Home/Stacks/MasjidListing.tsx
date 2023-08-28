import React from 'react';
import { View, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

import { ListEmptyComponent } from '..';
import { GapView, MasjidListCard, MyTitle } from '../../../components';
import { Masjid } from '../../../types/masjidControllerTypes';

export default function MasjidListing({
  data,
  setStep = () => {},
  contentOpacity = 0,
}: {
  data: Masjid[];
  setStep: any;
  contentOpacity?: Animated.AnimatedInterpolation<string | number> | number;
}) {
  const navigation = useNavigation();

  return (
    <View>
      <View style={{ alignSelf: 'center', top: 130 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Masjid Subscriptions" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <FlatList
        style={{ top: 130 }}
        data={data}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 15 }}
        renderItem={({ item, index }) => (
          <MasjidListCard
            key={index}
            onPress={() => setStep(1)}
            masjidName={item.name ?? ''}
          />
        )}
        ItemSeparatorComponent={GapView}
        ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
      />
    </View>
  );
}
