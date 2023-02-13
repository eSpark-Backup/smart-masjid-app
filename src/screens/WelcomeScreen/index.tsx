import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { GapView, Joined, MyText, MyTitle } from '../../components';
import { Wrapper } from '../../containers';

export default function App() {
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper onBackPress={goBack}>
      <MyTitle
        style={{ alignSelf: 'center', textAlign: 'center' }}
        text={`Welcome to\nSmart Adhan`}
      />
      <GapView length={85} />
      <MyText
        size={16}
        textStyle={{ textAlign: 'center' }}
        text="Have you purchased the adhan device ?"
      />
      <GapView length={80} />
      <Joined containerStyle={{ alignSelf: 'center' }} />
    </Wrapper>
  );
}
