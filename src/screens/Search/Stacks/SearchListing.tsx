import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  PermissionsAndroid,
  Platform,
  Animated,
  AppState,
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

const SearchListing = ({
  onPress,
  setUserLocation,
  contentOpacity = 0,
}: {
  onPress?: (masjidDetail: Masjid) => void;
  setUserLocation?: (e: any) => void;
  contentOpacity: any;
}) => {
  const state: State<GlobalProps> = useHookstate(globalStore);
  const isFocused = useIsFocused();
  const [masjidList, setMasjidList] = useState<Masjid[]>([]);
  const [zipCode, setZipCode] = useState('');
  const [loader, setLoader] = useState(false);
  const [locationStatus, setlocationStatus] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isFocused) {
      const subscription = AppState.addEventListener(
        'change',
        async appState => {
          if (appState == 'active') {
            const enable = await systemSetting.isLocationEnabled();
            checkLocation(enable, false);
          }
        },
      );

      return () => {
        subscription.remove();
      };
    }
  }, [isFocused]);

  const checkLocation = async (locationStatus: boolean, pressed?: boolean) => {
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
            console.log('chala2');
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
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED && locationStatus) {
          console.log('chala2');
          onCurrentLocationPress();
          setMessage('');
        } else if (
          granted != PermissionsAndroid.RESULTS.GRANTED &&
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
      if (!enable && !locationStatus) {
        setMasjidList([]);
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
      }
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  function _handleGPSProviderEvent(e: any) {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      setlocationStatus(false);
      setMasjidList([]);
      if (zipCode == 'Your Location') {
        setZipCode('');
      }
    } else {
      setlocationStatus(true);
      console.log('check');
    }
  }

  useEffect(() => {
    _startLocationCheck(_handleGPSProviderEvent);
    checkLocationAdapter();
    return () => {
      _stopLocationCheck();
    };
  }, [locationStatus]);

  useEffect(() => {
    if (message != '') {
      setMasjidList([]);
    }
  }, [message]);

  const onSearch = async (zipCode: string, lat?: string, long?: string) => {
    state.globalLoading.set(true);
    // setLoader(true);
    if (zipCode != 'Your Location') {
      setZipCode(zipCode);
      const res: any = await SearchMasjidByLocation(zipCode, lat, long);
      if (res?.length > 0) {
        setMasjidList(res);
      } else {
        setMasjidList([]);
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
    Geolocation.getCurrentPosition(info => {
      setUserLocation?.(info.coords);
      onSearch(
        '',
        info.coords.latitude.toString(),
        info.coords.longitude.toString(),
      );
      setZipCode('Your Location');
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
          <Card
            backgroundColor="#ffffff"
            style={{
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
            }}
            width={WINDOW_WIDTH - 30}>
            <MyInput
              searchBar
              onFocus={() => {
                if (zipCode == 'Your Location') {
                  setZipCode('');
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
                zipCode.length > 0 && zipCode != 'Your Location'
                  ? 'No masjid found for the zip code'
                  : locationStatus
                  ? 'No masjid found near you'
                  : 'Enter Zip Code to search masjid near you'
              }
            />
          }
        />
      </View>
    </View>
  );
};

export default SearchListing;
