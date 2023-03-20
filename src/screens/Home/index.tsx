import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ScrollView } from 'react-native';
import { SearchMasjidSvg } from '../../assets';
import { GapView, MyText, Rounded } from '../../components';
import { Wrapper } from '../../containers';
import { BottomNavigationParamList } from '../../types';
import { MasjidDetails, MasjidListing } from './Stacks';
import ConnectedDevices from './Stacks/ConnectedDevices';

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

// Screen Components
export const ListEmptyComponent = ({ navigation }: { navigation: any }) => {
  return (
    <ScrollView>
      <View style={{ alignItems: 'center' }}>
        <GapView length={30} />
        <MyText
          text={`You have not subscribes to a\nmasjid yet`}
          textStyle={{ textAlign: 'center', fontSize: 16 }}
        />
        <GapView length={30} />
        <SearchMasjidSvg />
        <GapView length={30} />
        <MyText
          text={`Search for a masjid near you`}
          textStyle={{ textAlign: 'center', fontSize: 16 }}
        />
        <GapView />
        <Rounded onPress={() => navigation.navigate('Search')} label="Search" />
      </View>
    </ScrollView>
  );
};

export default function Home() {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  const isFocused = useIsFocused();
  const data = Array(10).fill(1)
  // const data: any = [];
  const [step, setStep] = useState(0);

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

  return (
    <Wrapper
      onBackPress={onBackPress}
      showFooter={false}
      bgImageSpacer={false}>
      {step == 0 && <MasjidListing setStep={setStep} data={data} />}
      {step == 1 && <MasjidDetails setStep={setStep} />}
      {step == 2 && <ConnectedDevices />}
    </Wrapper>
  );
}
