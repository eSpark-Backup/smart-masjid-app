import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SearchMasjidByLocation } from '../../../api/masjidController';
import { GapView, MasjidListCard, MyInput } from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Card } from '../../../containers';
import { Masjid } from '../../../types/masjidControllerTypes';
import { ListEmptyComponent } from '../../Home';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyDPO63dIpxQVdsZPynkYi0Ee8FxW_mwti8'); // use a valid API key

const SearchListing = ({
  onPress,
}: {
  onPress?: (masjidDetail: Masjid) => void;
}) => {
  const [masjidList, setMasjidList] = useState<Masjid[]>([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      console.log('Locaations: ', info);
      // Search by geo-location (reverse geo-code)
      Geocoder.from(info.coords.latitude, info.coords.longitude)
        .then(json => {
          var addressComponent = json?.results[0]?.address_components[0];
          console.log(addressComponent, json);
        })
        .catch(error => console.warn(error));
    });
  }, []);

  const onSearch = async (zipCode: string) => {
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
            onSearch={onSearch}
          />
        </Card>
      </View>
      <GapView length={30} />
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
