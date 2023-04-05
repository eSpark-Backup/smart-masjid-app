import React from 'react';
import { FlatList, View } from 'react-native';
import { GapView, MasjidListCard, MyInput } from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Card } from '../../../containers';

const SearchListing = ({ onPress }: { onPress?: () => void }) => (
  <View
    style={{
      top: 60,
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      width: WINDOW_WIDTH,
    }}>
    <View style={{}}>
      <Card width={300}>
        <MyInput
          searchBar
          inputStyle={{ width: 250 }}
          placeholder="Enter Zip Code"
        />
      </Card>
    </View>
    <GapView length={30} />
    <FlatList
      data={Array(10).fill(1)}
      contentContainerStyle={{ paddingBottom: 240, paddingTop: 10 }}
      renderItem={() => (
        <MasjidListCard
          onPress={onPress}
          isSearch
          masjidName="Masjid Ar - Rahman"
        />
      )}
      ItemSeparatorComponent={GapView}
    />
  </View>
);

export default SearchListing;
