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
import { DeviceListing, MasjidDetails, SearchListing } from './Stacks';

type SearchNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'HomeBottomTab'
>;

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
