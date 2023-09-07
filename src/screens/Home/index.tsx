import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

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
  const isFocused = useIsFocused();
  const userData = useHookstate(userStore.userData).get();
  const [step, setStep] = useState(0);
  const [selectedMasjid, setSelectedMasjid] =
    useState<Immutable<Masjid> | null>(null);
  const {
    getMasjidListSubscribedByUser,
    store: { userMasjidList },
    isLoading,
  } = useMasjid();

  const uniqueObjects: Masjid[] = [];
  const uniqueIds = new Set();
  userMasjidList?.forEach(obj => {
    if (!uniqueIds?.has(obj.id)) {
      uniqueIds?.add(obj.id);
      uniqueObjects?.push(obj as any);
    }
  });

  useEffect(() => {
    setStep(0);
    GetUserDevices(userData?.id?.toString() ?? '');
    getMasjidListSubscribedByUser(userData?.id?.toString() ?? '');
  }, [isFocused]);

  useEffect(() => {
    console.log('chala kia?');

    if (step == 0 && uniqueObjects?.length == 1 && uniqueObjects != null) {
      setStep(1);
      if (typeof uniqueObjects?.[0] == 'object') {
        setSelectedMasjid(uniqueObjects?.[0]);
      }
    } else {
      if (step != 1) {
        setSelectedMasjid(null);
        masjidStore.salahTimings.set([]);
      }
    }
  }, [uniqueObjects]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

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
            <OverlayLoader isShow={isLoading} />
            {step == 0 && (
              <MasjidListing
                contentOpacity={props.contentOpacity}
                setStep={setStep}
                onPress={setSelectedMasjid}
                data={userMasjidList as Masjid[]}
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
