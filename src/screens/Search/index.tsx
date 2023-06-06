import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SubscribeMasjid } from '../../api/deviceController';
import { ConnectedDevice } from '../../assets';
import {
  DeviceListItem,
  GapView,
  LogoutModal,
  MapBox,
  MasjidListCard,
  MyDivider,
  MyInput,
  MyText,
  OverlayLoader,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { Masjid } from '../../types/masjidControllerTypes';
import { DeviceListing, MasjidDetails, SearchListing } from './Stacks';
import Toast from 'react-native-toast-message';
import { getPreciseDistance, getDistance } from 'geolib';

type SearchNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

export default function Search() {
  const [step, setStep] = useState(0);
  const navigation = useNavigation<SearchNavigationProps['navigation']>();
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid>();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    setStep(0);
  }, [isFocused]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const onSubscribe = async (deviceId: string, masjidId: string) => {
    console.log('deviceId', deviceId, 'masjidId', masjidId);
    setLoading(true);
    const result = await SubscribeMasjid(deviceId, masjidId);
    if (result) {
      Toast.show({
        text2: 'Masjid Subscribed',
        type: 'success',
      });
      navigation.navigate('Home');
    }
    setLoading(false);
  };
  return (
    <>
      <OverlayLoader isShow={loading} />
      <LogoutModal
        visible={showError}
        message="Please note that the selected mosque is located far from your current location. As a result, the prayer timings may differ significantly"
        onAllowed={() => {
          setStep(2);
          setShowError(false);
        }}
        onClose={() => setShowError(false)}
        title2="Ok"
        title1="Cancel"
      />
      <Wrapper
        onBackPress={onBackPress}
        showFooter={false}
        bgImageSpacer={false}>
        {step == 0 && (
          <SearchListing
            onPress={(masjidDetails: Masjid) => {
              setStep(1);
              setSelectedMasjid(masjidDetails);
            }}
            setUserLocation={setUserLocation}
          />
        )}
        {step == 1 && (
          <MasjidDetails
            masjidDetails={selectedMasjid}
            onSubscribe={() => {
              // @ts-ignore
              const distance = getDistance(userLocation, {
                latitude: selectedMasjid?.location.coordinates[0],
                longitude: selectedMasjid?.location.coordinates[1],
              });
              if (distance / 1609 > 10) {
                setShowError(true);
              } else {
                setStep(2);
              }
            }}
          />
        )}
        {step == 2 && (
          <DeviceListing
            masjidDetails={selectedMasjid}
            onPress={device =>
              onSubscribe(
                device.id.toString(),
                selectedMasjid?.id.toString() ?? '',
              )
            }
          />
        )}
      </Wrapper>
    </>
  );
}
