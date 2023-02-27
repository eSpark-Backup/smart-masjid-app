import React, {useEffect, useState} from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ScrollView, FlatList } from 'react-native';
import { ConnectedDevice, SearchMasjidSvg } from '../../assets';
import {
  GapView,
  MasjidListCard,
  MyText,
  MyTitle,
  Rounded,
  TextLabel,
} from '../../components';
import { Wrapper } from '../../containers';
import { BottomNavigationParamList } from '../../types';

type HomeNavigationProps = NativeStackScreenProps<
  BottomNavigationParamList,
  'Home'
>;

// Screen Components
const ListEmptyComponent = ({
  navigation,
}: {
  navigation: HomeNavigationProps['navigation'];
}) => {
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

const MasjidListing = ({ data }: { data: any }) => {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();

  return (
    <FlatList
      data={data}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      renderItem={() => <MasjidListCard masjidName="Masjid Ar - Rahman" />}
      ItemSeparatorComponent={GapView}
      ListEmptyComponent={<ListEmptyComponent navigation={navigation} />}
    />
  );
};

const MasjidDetails = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TextLabel label="Masjid Ar - Rahman" />
      <GapView length={5} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ConnectedDevice />
        <MyText text="Connected Devices " />
      </View>
      <GapView length={15} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
        }}>
          <MyText text='Next Adhan in' textStyle={{fontWeight: 'bold'}} />
          <MyTitle text='06 : 09 : 00' />
        </ScrollView>
    </View>
  );
};

export default function Home() {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  const isFocused = useIsFocused()
  // const data = Array(10).fill(1)
  const data: any = [];
  const [step, setStep] = useState(1)

  useEffect(() => {
    setStep(1);
  }, [isFocused]);

  const onBackPress = () => {
    if (step != 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };


  return (
    <Wrapper onBackPress={onBackPress} showFooter={false} bgImageSpacer={step == 0 ? true : false} >
      {step == 0 && <MasjidListing data={data} />}
      {step == 1 && <MasjidDetails />}
    </Wrapper>
  );
}
