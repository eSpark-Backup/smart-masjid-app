import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ConnectedDevice } from '../../assets';
import {
  DeviceListItem,
  GapView,
  MapBox,
  MasjidListCard,
  MyDivider,
  MyInput,
  MyText,
  Rounded,
  TextLabel,
  TimeTable,
} from '../../components';
import { WINDOW_WIDTH } from '../../constants';
import { Card, Wrapper } from '../../containers';
import { BottomNavigationParamList, RootStackParamList } from '../../types';

type SearchNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

const SearchListing = ({ onPress }: { onPress?: () => void }) => (
  <View
    style={{
      top: 60,
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      width: WINDOW_WIDTH,
    }}>
    <View style={{}}>
      <Card width={300}>
        <MyInput
          searchBar
          inputStyle={{ width: 250 }}
          placeholder="Enter Zip Code"
        />
      </Card>
    </View>
    <GapView length={30} />
    <FlatList
      data={Array(10).fill(1)}
      contentContainerStyle={{ paddingBottom: 240, paddingTop: 10 }}
      renderItem={() => (
        <MasjidListCard
          onPress={onPress}
          isSearch
          masjidName="Masjid Ar - Rahman"
        />
      )}
      ItemSeparatorComponent={GapView}
    />
  </View>
);

const MasjidDetails = ({ onSubscribe }: { onSubscribe: () => void }) => {
  const [subscribe, setSubscribe] = useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={45} />
      <TextLabel label="Masjid Ar - Rahman" textStyle={{ paddingBottom: 5 }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <GapView length={15} />
        <MyText text="Method: Islamic Society of North America" size={16} />
        <GapView length={5} />
        <MyText
          text="Jurisdiction: Standard (Shafi, Hanbali, Maliki)"
          size={16}
        />
        <GapView length={20} />
        <MapBox />
        <GapView length={10} />
        <View style={{ padding: 10 }}>
          <TimeTable
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
        </View>
        <GapView />
        {!subscribe ? (
          <Rounded
            onPress={onSubscribe}
            disabled={false}
            label="Subscribe"
            width={'70%'}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: 41,
              width: '70%',
              backgroundColor: '#FF6464',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            onPress={() => setSubscribe(!subscribe)}>
            <TextLabel label="Unsubscribe" textStyle={{ color: '#ffffff' }} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const DeviceListing = ({ onPress }: { onPress?: () => void }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GapView length={45} />
      <TextLabel label="Masjid Ar - Rahman" textStyle={{ paddingBottom: 5 }} />
      <GapView length={60} />
      <TextLabel
        label="Select Device"
        textStyle={{ color: '#3E3E3E', alignSelf: 'center' }}
      />
      <GapView length={80} />
      <Card>
        <View>
          <FlatList
            data={[
              { name: 'Home', subscription: 'No Subscription', online: true },
              { name: 'Home', subscription: 'No Subscription', online: false },
              { name: 'Home', subscription: 'Masjid Al Aqsa', online: true },
            ]}
            renderItem={({ item }) => (
              <DeviceListItem
                onPress={onPress}
                title={item.name}
                subTitle={item.subscription}
                disabled={
                  !(item.subscription == 'No Subscription' && item.online)
                }
                online={item.online}
              />
            )}
            ItemSeparatorComponent={() => (
              <MyDivider
                backgroundColor="#9E9F9F"
                height={0.25}
                style={{
                  paddingHorizontal: 20,
                  alignSelf: 'center',
                  width: '100%',
                }}
              />
            )}
          />
        </View>
      </Card>
    </View>
  );
};
export default function Search() {
  const [step, setStep] = useState(0);
  const navigation = useNavigation<SearchNavigationProps['navigation']>();
  const isFocused = useIsFocused();

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
    <Wrapper onBackPress={onBackPress} showFooter={false} bgImageSpacer={false}>
      {step == 0 && <SearchListing onPress={() => setStep(1)} />}
      {step == 1 && <MasjidDetails onSubscribe={() => setStep(2)} />}
      {step == 2 && <DeviceListing onPress={() => navigation.navigate('Home')} />}
    </Wrapper>
  );
}
