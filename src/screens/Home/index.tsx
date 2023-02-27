import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ScrollView, FlatList } from 'react-native';
import { ConnectedDevice, InfoCircle, SearchMasjidSvg } from '../../assets';
import {
  GapView,
  MasjidListCard,
  MyText,
  MyTitle,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../components';
import { Wrapper } from '../../containers';
import { BottomNavigationParamList } from '../../types';
import MyDatePicker from '../../components/MyDatePicker';

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
      <MyText text="Next Adhan in" textStyle={{ fontWeight: 'bold' }} />
      <GapView length={5} />
      <MyTitle text="06 : 09 : 00" />
      <GapView length={25} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
          padding: 5,
        }}>
        <TimeTable
          isEdit
          header={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ height: 20, width: 20 }} />
              <MyDatePicker
                onDateChange={e => {
                  console.log('onDateChange', e);
                }}
              />
              <InfoCircle />
            </View>
          }
          data={[
            {
              name: 'Fajar',
              azanTiming: '5:50',
              iqamahTiming: '6:00',
            },
            {
              name: 'Dhuhr',
              azanTiming: '1:00',
              iqamahTiming: '1:30',
            },
            {
              name: 'Asr',
              azanTiming: '4:50',
              iqamahTiming: '5:00',
            },
            {
              name: 'Mugrib',
              azanTiming: '5:50',
              iqamahTiming: '6:00',
            },
            {
              name: 'Isha',
              azanTiming: '6:50',
              iqamahTiming: '8:00',
            },
          ]}
        />
        <GapView length={20} />

        <TimeTable
          isMute
          header={
            <View
              style={{
                alignItems: 'center',
              }}>
              <TextLabel label="Jumuah" />
            </View>
          }
          headings={['Salah', 'Khutba']}
          data={[
            {
              name: 'Jumma 1',
              azanTiming: '12:10',
            },
            {
              name: 'Jumma 2',
              azanTiming: '01:10',
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

export default function Home() {
  const navigation = useNavigation<HomeNavigationProps['navigation']>();
  const isFocused = useIsFocused();
  // const data = Array(10).fill(1)
  const data: any = [];
  const [step, setStep] = useState(1);

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
    <Wrapper
      onBackPress={onBackPress}
      showFooter={false}
      bgImageSpacer={step == 0 ? true : false}>
      {step == 0 && <MasjidListing data={data} />}
      {step == 1 && <MasjidDetails />}
    </Wrapper>
  );
}
