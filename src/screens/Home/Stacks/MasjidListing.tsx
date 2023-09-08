import React from 'react';
import { View, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

import { ListEmptyComponent } from '..';
import { GapView, MasjidListCard, MyTitle } from '../../../components';
import { Masjid } from '../../../types/masjidControllerTypes';

export default function MasjidListing({
  data,
  setStep = () => {},
  contentOpacity = 0,
  onPress,
}: {
  data: Masjid[];
  setStep: any;
  contentOpacity?: Animated.AnimatedInterpolation<string | number> | number;
  onPress: (data: Masjid) => void;
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
        style={{ top: 120 }}
        data={data}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 15 }}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        renderItem={({ item, index }) => {
          console.log('masjid item', item);

          return (
            <MasjidListCard
              key={index}
              onPress={() => {
                setStep(1);
                onPress(item);
              }}
              masjidName={item.name ?? ''}
              masjidLogo={item.logo ? { uri: item.logo } : undefined}
            />
          );
        }}
        ItemSeparatorComponent={GapView}
        ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
      />
    </View>
  );
}
