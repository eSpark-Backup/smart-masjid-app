import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { getDistance } from 'geolib';
import crashlytics from '@react-native-firebase/crashlytics';

import { SubscribeMasjid } from '../../api/deviceController';
import { LogoutModal, OverlayLoader } from '../../components';
import { Wrapper } from '../../containers';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { Masjid } from '../../types/masjidControllerTypes';
import { DeviceListing, MasjidDetails, SearchListing } from './Stacks';

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
    if (isFocused) {
      setStep(0);
    }
  }, [isFocused]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => backHandler.remove();
  }, [step]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
    return true;
  };

  const onSubscribe = async (deviceId: string, masjidId: string) => {
    try {
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
    } catch (e) {
      crashlytics().recordError(e as Error);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 0:
        return 'Search Masjid';
      case 1:
        return 'Masjid Search';
      case 2:
        return 'Masjid Search';
      default:
        break;
    }
  };

  return (
    <Wrapper
      onBackPress={onBackPress}
      showFooter={false}
      title={getTitle()}
      bgImageSpacer={false}>
      {({ props }) => {
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
            {step == 0 && (
              <SearchListing
                contentOpacity={props.contentOpacity}
                onPress={(masjidDetails: Masjid) => {
                  setStep(1);
                  setSelectedMasjid(masjidDetails);
                }}
                setUserLocation={setUserLocation}
              />
            )}

            {step == 1 && (
              <MasjidDetails
                contentOpacity={props.contentOpacity}
                masjidDetails={selectedMasjid}
                onSubscribe={() => {
                  // @ts-ignore
                  const distance = getDistance(userLocation, {
                    latitude: selectedMasjid?.location.coordinates[0],
                    longitude: selectedMasjid?.location.coordinates[1],
                  });
                  // for converting meter into mile dividing distance by 1609
                  if (distance / 1609 > 50) {
                    setShowError(true);
                  } else {
                    setStep(2);
                  }
                }}
              />
            )}
            {step == 2 && (
              <DeviceListing
                contentOpacity={props.contentOpacity}
                masjidDetails={selectedMasjid}
                onPress={device =>
                  onSubscribe(
                    device.id.toString(),
                    selectedMasjid?.id.toString() ?? '',
                  )
                }
              />
            )}
          </>
        );
      }}
    </Wrapper>
  );
}
