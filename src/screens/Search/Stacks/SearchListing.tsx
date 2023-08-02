import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  PermissionsAndroid,
  Platform,
  Animated,
} from 'react-native';
import { SearchMasjidByLocation } from '../../../api/masjidController';
import {
  GapView,
  MasjidListCard,
  MyInput,
  OverlayLoader,
  TextLabel,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Card } from '../../../containers';
import { Masjid } from '../../../types/masjidControllerTypes';
import { ListEmptyComponent } from '../../Home';
import { _requestUserLocationPermission } from '../../../utils/functions';

const SearchListing = ({
  onPress,
  setUserLocation,
  contentOpacity = 0,
}: {
  onPress?: (masjidDetail: Masjid) => void;
  setUserLocation?: (e: any) => void;
  contentOpacity: any;
}) => {
  const [masjidList, setMasjidList] = useState<Masjid[]>([]);
  const [zipCode, setZipCode] = useState('');
  const [loader, setLoader] = useState(false);

  const checkLocation = async () => {
    try {
      if (Platform.OS == 'ios') {
        await _requestUserLocationPermission();
        onCurrentLocationPress();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onCurrentLocationPress();
        } else {
          _requestUserLocationPermission();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkLocation();
  }, []);

  const onSearch = async (zipCode: string, lat?: string, long?: string) => {
    setLoader(true);
    if (zipCode) setZipCode(zipCode);
    const res: any = await SearchMasjidByLocation(zipCode, lat, long);
    if (res?.length > 0) {
      setMasjidList(res);
    } else {
      setMasjidList([]);
    }
    setLoader(false);
  };

  const onCurrentLocationPress = () => {
    Geolocation.getCurrentPosition(info => {
      setUserLocation?.(info.coords);
      onSearch(
        '',
        info.coords.latitude.toString(),
        info.coords.longitude.toString(),
      );
      setZipCode('Your Location');
      // Search by geo-location (reverse geo-code)
    });
  };

  return (
    <View
      style={{
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: WINDOW_WIDTH,
      }}>
      <OverlayLoader isShow={loader} />
      <View style={{ alignSelf: 'center', top: 110 }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <TextLabel
            label="Search Masjid"
            textStyle={{ alignSelf: 'center' }}
          />
        </Animated.View>
        <GapView length={50} />
      </View>
      <View style={{ top: 110 }}>
        <View>
          <Card backgroundColor="#ffffff" width={WINDOW_WIDTH - 28}>
            <MyInput
              searchBar
              onFocus={() => {
                if (zipCode == 'Your Location') {
                  setZipCode('');
                }
              }}
              onCurrentLocationPress={onCurrentLocationPress}
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
              location={`${item.address1} ${item.address2 ?? ''}, ${
                item.city
              }, ${item.state} ${item.zip}`}
              masjidLogo={{ uri: item.logo }}
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
    </View>
  );
};

export default SearchListing;
