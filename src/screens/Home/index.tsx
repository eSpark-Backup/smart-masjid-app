import React from 'react';
import { View, Text } from 'react-native';
import { SearchMasjidSvg } from '../../assets';
import { GapView, MyText, Rounded } from '../../components';
import { Wrapper } from '../../containers';

export default function Home() {
  return (
    <Wrapper showFooter={false}>
      <View style={{alignItems: 'center'}}>
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
        <Rounded label='Search' />
      </View>
    </Wrapper>
  );
}
