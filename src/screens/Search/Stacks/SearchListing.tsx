import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  PermissionsAndroid,
  Platform,
  Animated,
  AppState,
  AppStateStatus,
  PermissionStatus,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import crashlytics from '@react-native-firebase/crashlytics';
import systemSetting from 'react-native-system-setting';
import Toast from 'react-native-toast-message';
//@ts-ignore
import RNSettings from 'react-native-settings';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';

import { SearchMasjidByLocation } from '../../../api/masjidController';
import {
  GapView,
  MasjidListCard,
  MyInput,
  MyTitle,
  OverlayLoader,
} from '../../../components';
import { WINDOW_WIDTH } from '../../../constants';
import { Card } from '../../../containers';
import { Masjid } from '../../../types/masjidControllerTypes';
import { ListEmptyComponent } from '../../Home';
import { _requestUserLocationPermission } from '../../../utils/functions';
import { _startLocationCheck, _stopLocationCheck } from '../utils/functions';
import { useIsFocused } from '@react-navigation/native';
import { State, useHookstate } from '@hookstate/core';
import { globalStore } from '../../../store/GlobalStates';
import { GlobalProps } from '../../../types';
import { err } from 'react-native-svg/lib/typescript/xml';
import { useUpdateEffect } from '../../../utils';

const SearchListing = ({
  onPress,
  setUserLocation,
  contentOpacity = 0,
  setLocation,
  location,
  searchedMasjids,
  setSearchedMasjids,
  searchedText,
  setSearchedText,
}: {
  onPress?: (masjidDetail: Masjid) => void;
  setUserLocation?: (e: any) => void;
  contentOpacity: any;
  setLocation?: (val: boolean) => void;
  location?: boolean | null;
  searchedMasjids: Masjid[];
  setSearchedMasjids: (masjids: Masjid[]) => void;
  searchedText: string;
  setSearchedText: (text: string) => void;
}) => {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const isFocused = useIsFocused();
  const [masjidList, setMasjidList] = useState<Masjid[]>(searchedMasjids);
  const [zipCode, setZipCode] = useState(searchedText);
  const [loader, setLoader] = useState(false);
  const [locationStatus, setlocationStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [ApState, setApState] = useState<AppStateStatus>(AppState.currentState);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const checkLocationSetting = async () => {
    const enable = await systemSetting.isLocationEnabled();
    checkLocation(enable, false);
  };

  const requestLocationSetting = async () => {
    const enable = await systemSetting.isLocationEnabled();
    checkLocation(enable, false, true);
  };

  useEffect(() => {
    console.log('chala kiaaaaaa', ApState);

    if (isFocused && ApState == 'active') {
      requestLocationSetting();
    }
  }, [isFocused]);

  useEffect(() => {
    console.log('chala kiaaaaaa2', ApState);

    if (ApState == 'active') {
      checkLocationSetting();
    }
  }, [ApState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      setApState(nextAppState);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkLocation = async (
    locationStatus: boolean,
    pressed?: boolean,
    requested?: boolean,
  ) => {
    try {
      if (Platform.OS == 'ios') {
        await requestMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]).then(status => {
          console.log('status', status);
          if (
            (status['ios.permission.LOCATION_ALWAYS'] == 'granted' ||
              status['ios.permission.LOCATION_WHEN_IN_USE'] == 'granted') &&
            locationStatus
          ) {
            onCurrentLocationPress();
            setMessage('');
          } else if (
            status['ios.permission.LOCATION_ALWAYS'] != 'granted' &&
            status['ios.permission.LOCATION_WHEN_IN_USE'] != 'granted' &&
            locationStatus == false
          ) {
            if (pressed) {
              Toast.show({
                text1: 'Alert!',
                text2: 'Enable Location Permission & Turn on Location',
                type: 'success',
                visibilityTime: 10000,
              });
            } else {
              setMessage('Enable Location Permission');
            }
          } else if (locationStatus == false) {
            if (pressed) {
              Toast.show({
                text1: 'Alert!',
                text2: 'Turn on Location',
                type: 'success',
              });
            } else {
              setMessage('');
            }
          } else {
            if (pressed) {
              Toast.show({
                text1: 'Alert!',
                text2: 'Enable Location Permission',
                type: 'success',
              });
            } else {
              setMessage('Enable Location Permission');
            }
          }
        });
      } else {
        let granted: PermissionStatus | boolean | null = null;
        if (requested) {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        } else {
          granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }

        console.log(
          'request | grant | location',
          requested,
          granted,
          locationStatus,
        );

        if (
          (granted === PermissionsAndroid.RESULTS.GRANTED &&
            requested == true &&
            locationStatus) ||
          (granted === true && !requested && locationStatus)
        ) {
          onCurrentLocationPress();
          setMessage('');
        } else if (
          (granted != PermissionsAndroid.RESULTS.GRANTED &&
            requested == true &&
            locationStatus == false) ||
          (granted != true && !requested && locationStatus == false)
        ) {
          if (pressed) {
            Toast.show({
              text1: 'Alert!',
              text2: 'Enable Location Permission & Turn on Location',
              type: 'success',
              visibilityTime: 10000,
            });
          } else {
            setMessage('Enable Location Permission');
          }
          // _requestUserLocationPermission();
        } else if (locationStatus == false) {
          if (pressed) {
            Toast.show({
              text1: 'Alert!',
              text2: 'Turn on Location',
              type: 'success',
            });
          } else {
            setMessage('');
          }
        } else {
          if (pressed) {
            Toast.show({
              text1: 'Alert!',
              text2: 'Enable Location Permission',
              type: 'success',
            });
          } else {
            setMessage('Enable Location Permission');
          }
        }
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  const checkLocationAdapter = async () => {
    try {
      const enable = await systemSetting.isLocationEnabled();
      checkLocation(enable);
      if (!enable && !locationStatus && searchedMasjids.length < 1) {
        setMasjidList([]);
        setSearchedMasjids([]);
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const locationAdapterPressed = async () => {
    try {
      const enable = await systemSetting.isLocationEnabled();
      checkLocation(enable, true);
      if (!enable && !locationStatus) {
        setMasjidList([]);
        setSearchedMasjids([]);
        setZipCode('');
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  function _handleGPSProviderEvent(e: any) {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      setlocationStatus(false);
      setMasjidList([]);
      setSearchedMasjids([]);
      if (zipCode == 'Your Location') {
        setZipCode('');
        setSearchedText('');
        setLocation!(false);
      }
    } else {
      setlocationStatus(true);
      console.log('check');
    }
  }
  console.log('location', location);
  useEffect(() => {
    if (location == null) {
      _startLocationCheck(_handleGPSProviderEvent);
      checkLocationAdapter();
      return () => {
        _stopLocationCheck();
      };
    }
  }, [locationStatus]);

  console.log('searchedMasjids.length', searchedMasjids.length);

  // useEffect(() => {
  //   if (message != '' && searchedMasjids.length < 1) {
  //     setMasjidList([]);
  //     setSearchedMasjids([]);
  //   }
  // }, [message]);

  console.log(
    'state.countryCode.get() as string,',
    state.countryCode.get() as string,
  );

  const onSearch = async (zipCode: string, lat?: string, long?: string) => {
    state.globalLoading.set(true);
    // setLoader(true);
    if (zipCode != 'Your Location') {
      setZipCode(zipCode);
      setSearchedText(zipCode);
      const res: any = await SearchMasjidByLocation(
        zipCode,
        lat,
        long,
        state.countryCode.get() as string,
      );
      if (res?.length > 0) {
        setMasjidList(res);
        setSearchedMasjids(res);
      } else {
        setMasjidList([]);
        setSearchedMasjids([]);
      }
      setMessage('');
      state.globalLoading.set(false);
      // setLoader(false);
    } else {
      setMessage('');
      onCurrentLocationPress();
      state.globalLoading.set(false);
      // setLoader(false);
    }
  };

  const onCurrentLocationPress = () => {
    console.log('Yaha aya');
    Geolocation.getCurrentPosition(info => {
      setUserLocation?.(info.coords);
      onSearch(
        '',
        info.coords.latitude.toString(),
        info.coords.longitude.toString(),
      );
      setZipCode('Your Location');
      setSearchedText('Your Location');
      setLocation!(true);
      setMessage('');
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
      {/* <OverlayLoader isShow={loader} /> */}
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text="Search Masjid" />
        </Animated.View>
      </View>
      <View style={{ marginTop: 10 }}>
        <View>
          <Card width={WINDOW_WIDTH - 30}>
            <MyInput
              searchBar
              onFocus={() => {
                if (zipCode == 'Your Location') {
                  setZipCode('');
                  setSearchedText('');
                  setLocation!(false);
                }
              }}
              onCurrentLocationPress={locationAdapterPressed}
              inputStyle={{ width: WINDOW_WIDTH - 80 }}
              placeholder="Enter Zip Code"
              onSearch={onSearch}
              value={zipCode}
            />
          </Card>
        </View>
        <GapView length={20} />
        <FlatList
          data={masjidList}
          renderItem={({ item, index }) => (
            <MasjidListCard
              onPress={() => onPress?.(item)}
              isSearch
              masjidName={item?.name}
              location={`${item.address1} ${item.address2 ?? ''}, ${
                item.city
              }, ${item.state} ${item.zip}`}
              masjidLogo={item.logo ? { uri: item.logo } : undefined}
            />
          )}
          ItemSeparatorComponent={GapView}
          ListEmptyComponent={
            <ListEmptyComponent
              message1={''}
              link={message}
              onLinkPressed={_requestUserLocationPermission}
              isShowBtn={false}
              message2={
                zipCode?.length > 0 && zipCode != 'Your Location'
                  ? 'No Smart Masjid found for the Zip Code entered.'
                  : locationStatus
                  ? 'No Smart Masjid found near your Location. Try searching with Zip Code'
                  : 'Location turned off. Try searching with Zip Code'
              }
            />
          }
          ListHeaderComponent={<GapView length={5} />}
          ListFooterComponent={<GapView length={5} />}
        />
      </View>
    </View>
  );
};

export default SearchListing;
