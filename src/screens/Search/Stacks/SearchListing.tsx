import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SearchMasjidByLocation } from '../../../api/masjidController';
import {
  GapView,
  MasjidListCard,
  MyInput,
  TextLabel,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Card } from '../../../containers';
import { Masjid } from '../../../types/masjidControllerTypes';
import { ListEmptyComponent } from '../../Home';

const SearchListing = ({
  onPress,
}: {
  onPress?: (masjidDetail: Masjid) => void;
}) => {
  const [masjidList, setMasjidList] = useState<Masjid[]>([]);
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    // Geolocation.getCurrentPosition(info => {
    //   // Search by geo-location (reverse geo-code)
    // });
  }, []);

  const onSearch = async (zipCode: string) => {
    setZipCode(zipCode);
    const res: any = await SearchMasjidByLocation(zipCode);
    if (res?.length > 0) {
      setMasjidList(res);
    } else {
      setMasjidList([]);
    }
  };

  return (
    <View
      style={{
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: WINDOW_WIDTH,
      }}>
      <GapView length={20} />
      <TextLabel label="Search Masjid" textStyle={{ alignSelf: 'center' }} />
      <GapView length={50} />
      <View style={{ paddingTop: 15 }}>
        <Card backgroundColor="#ffffff" width={WINDOW_WIDTH - 28}>
          <MyInput
            searchBar
            inputStyle={{ width: WINDOW_WIDTH - 80 }}
            placeholder="Enter Zip Code"
            onSearch={onSearch}
            value={zipCode}
          />
        </Card>
      </View>
      <GapView />
      <FlatList
        data={masjidList}
        contentContainerStyle={{
          paddingBottom: 240,
          paddingTop: 10,
        }}
        renderItem={({ item, index }) => (
          <MasjidListCard
            onPress={() => onPress?.(item)}
            isSearch
            masjidName={item?.name}
            location={`${item.address1} ${item.address2 ?? ''}, ${item.city}, ${
              item.state
            } ${item.zip}`}
          />
        )}
        ItemSeparatorComponent={GapView}
        ListEmptyComponent={
          <ListEmptyComponent
            message1="There is no masjid near you"
            isShowBtn={false}
            message2="Search for different zip codes"
          />
        }
      />
    </View>
  );
};

export default SearchListing;
