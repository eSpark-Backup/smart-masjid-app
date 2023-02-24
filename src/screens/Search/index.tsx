import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  GapView,
  MasjidListCard,
  MyInput,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';

export default function Search() {
  return (
    <Wrapper showFooter={false} bgImageSpacer={false}>
      <View
        style={{
          top: 60,
          alignSelf: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          width: WINDOW_WIDTH,
        }}>
        <View style={{ right: WINDOW_WIDTH * 0.05 }}>
          <Card width={260}>
            <MyInput
              searchBar
              inputStyle={{ width: 250 }}
              placeholder="Enter Zip Code / City"
            />
          </Card>
        </View>
        <GapView length={30} />
        <FlatList
          data={Array(10).fill(1)}
          contentContainerStyle={{paddingBottom: 240, paddingTop: 10}}
          renderItem={() => (
            <MasjidListCard isSearch masjidName="Masjid Ar - Rahman" />
          )}
          ItemSeparatorComponent={GapView}
        />
      </View>
    </Wrapper>
  );
}
