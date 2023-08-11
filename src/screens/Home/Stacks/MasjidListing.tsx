import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Animated } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListEmptyComponent } from '..';
import {
  Accordian,
  GapView,
  MasjidListCard,
  TextLabel,
} from '../../../components';
import { Wrapper } from '../../../containers';

export default function MasjidListing({
  data,
  setStep = () => {},
  contentOpacity = 0,
}: {
  data: any;
  setStep: any;
  contentOpacity?: Animated.AnimatedInterpolation<string | number> | number;
}) {
  const navigation = useNavigation();

  return (
    <View>
      <View style={{ alignSelf: 'center', top: 130 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel label="Masjid Subscriptions" />
        </Animated.View>
        <GapView length={50} />
      </View>

      <FlatList
        style={{ top: 130 }}
        data={data}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 15 }}
        renderItem={({ index }) => (
          <MasjidListCard
            key={index}
            onPress={() => setStep(1)}
            masjidName="Masjid Ar - Rahman"
          />
        )}
        ItemSeparatorComponent={GapView}
        // ListFooterComponent={() => <GapView />}
        ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
      />
    </View>
  );
}
