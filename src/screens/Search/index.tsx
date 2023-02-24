import React from 'react';
import { ScrollView } from 'react-native';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ConnectedDevice } from '../../assets';
import {
  GapView,
  MapBox,
  MasjidListCard,
  MyInput,
  MyText,
  TextLabel,
  TimeTable,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';

const SearchListing = () => (
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
      contentContainerStyle={{ paddingBottom: 240, paddingTop: 10 }}
      renderItem={() => (
        <MasjidListCard isSearch masjidName="Masjid Ar - Rahman" />
      )}
      ItemSeparatorComponent={GapView}
    />
  </View>
);

const MasjidDetails = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ConnectedDevice />
        <MyText text="Connected Devices " />
      </View>
      <GapView length={25} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <MyText text="Method: Islamic Society of North America" size={16} />
        <GapView length={5} />
        <MyText
          text="Jurisdiction: Standard (Shafi, Hanbali, Maliki)"
          size={16}
        />
        <GapView length={20} />
        <MapBox />
        <GapView length={10} />
        <View style={{ padding: 10 }}>
          <TimeTable
            data={[
              {
                name: 'Fajar',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
              {
                name: 'Fajar',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
              {
                name: 'Fajar',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
              {
                name: 'Fajar',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
              {
                name: 'Fajar',
                azanTiming: '5:50',
                iqamahTiming: '6:00',
              },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default function Search() {
  return (
    <Wrapper showFooter={false} bgImageSpacer={false}>
      {/* <SearchListing /> */}
      <MasjidDetails />
    </Wrapper>
  );
}
