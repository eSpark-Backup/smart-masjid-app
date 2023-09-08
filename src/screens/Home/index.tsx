import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Immutable, useHookstate } from '@hookstate/core';

import { SearchMasjidSvg } from '../../assets';
import { GapView, MyText, OverlayLoader, Rounded } from '../../components';
import { Wrapper } from '../../containers';
import { BottomNavigationParamList } from '../../types';
import { MasjidDetails, MasjidListing } from './Stacks';
import ConnectedDevices from './Stacks/ConnectedDevices';
import { GetUserDevices } from '../../api/deviceController';
import { userStore } from '../../store/UserStore';
import { useMasjid } from '../../utils/hooks';
import { Masjid } from '../../types/masjidControllerTypes';
import { masjidStore } from '../../store/MasjidStore';
import { getListMasjidSubscribedByUser } from '../../api/masjidController';

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

type RouteProps = NativeStackScreenProps<BottomNavigationParamList, 'Home'>;

// Screen Components
export const ListEmptyComponent = ({
  navigation,
  message1 = `You have not subscribed to a\nmasjid yet`,
  message2 = `Search for a masjid near you`,
  isShowBtn = true,
}: {
  navigation?: any;
  message1?: string;
  message2?: string;
  isShowBtn?: boolean;
}) => {
  return (
    <ScrollView>
      <View style={{ alignItems: 'center' }}>
        <MyText
          text={message1}
          textStyle={{ textAlign: 'center', fontSize: 16, fontWeight: '500' }}
        />
        <GapView length={30} />
        <SearchMasjidSvg />
        <GapView length={30} />
        <MyText
          text={message2}
          textStyle={{ textAlign: 'center', fontSize: 16 }}
        />
        <GapView length={40} />
        {isShowBtn && (
          <Rounded
            onPress={() => navigation.navigate('Search')}
            label="Search"
          />
        )}
      </View>
    </ScrollView>
  );
};

export default function Home() {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  const { params } = useRoute<RouteProps['route']>();
  const isFocused = useIsFocused();
  const userData = useHookstate(userStore.userData).get();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uniqueObjects, setUniqueObjects] = useState<Masjid[]>([]);
  const [selectedMasjid, setSelectedMasjid] =
    useState<Immutable<Masjid> | null>(null);
  const {
    // getMasjidListSubscribedByUser,
    store: { userMasjidList },
    isLoading,
  } = useMasjid();

  useEffect(() => {
    if (isFocused && step == 0) {
      setLoading(true);
      GetUserDevices(userData?.id?.toString() ?? '');
      getListMasjidSubscribedByUser(userData?.id?.toString() ?? '').then(
        data => {
          let sData = data as Masjid[];
          const uniqueObj: Masjid[] = [];
          const uniqueIds = new Set();
          sData?.forEach(obj => {
            if (!uniqueIds?.has(obj?.id)) {
              uniqueIds?.add(obj?.id);
              uniqueObj?.push(obj as any);
            }
          });
          console.log('kiya mila', uniqueObj);
          setUniqueObjects(uniqueObj);
          if (step == 0 && uniqueObj?.length == 1 && uniqueObj != null) {
            setStep(1);
            if (typeof uniqueObj?.[0] == 'object') {
              setSelectedMasjid(uniqueObj?.[0]);
            }
          }
          setLoading(false);
        },
      );
    }
  }, [isFocused, step]);

  useEffect(() => {
    if (!isFocused) {
      setStep(0);
      console.log('huwa back?');
    }
    if (step != 1) {
      if (params?.masjidId) {
        setStep(1);
        if (typeof uniqueObjects?.[0] == 'object') {
          const selectedMasjid = uniqueObjects.filter(
            item => item.id.toString() === params?.masjidId,
          );
          console.log('chala ha xxx', selectedMasjid?.[0]);
          setSelectedMasjid(selectedMasjid?.[0]);
        }
      } else {
        setSelectedMasjid(null);
        masjidStore.salahTimings.set([]);
      }
    }
  }, [isFocused]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  console.log('uniqueObjects', uniqueObjects);

  return (
    <Wrapper
      showBack={step == 0 ? false : uniqueObjects?.length == 1 ? false : true}
      onBackPress={onBackPress}
      showFooter={false}
      title={'Masjid Subscriptions'}
      bgImageSpacer={false}>
      {({ props }) => {
        return (
          <>
            <OverlayLoader isShow={loading} />
            {step == 0 && (
              <MasjidListing
                contentOpacity={props.contentOpacity}
                setStep={setStep}
                onPress={setSelectedMasjid}
                data={uniqueObjects as Masjid[]}
              />
            )}
            {step == 1 && (
              <MasjidDetails
                contentOpacity={props.contentOpacity}
                setStep={setStep}
                isSingle={uniqueObjects?.length == 1}
                selectedMasjid={selectedMasjid as unknown as Masjid}
              />
            )}
            {step == 2 && (
              <ConnectedDevices contentOpacity={props.contentOpacity} />
            )}
          </>
        );
      }}
    </Wrapper>
  );
}
