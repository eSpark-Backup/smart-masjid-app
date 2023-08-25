import React from 'react';
import { ScrollView, View } from 'react-native';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Joined, MyTitle, GapView, MyText } from '../../components';
import { Wrapper } from '../../containers';
import { RootStackParamList } from '../../types';

type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;

export default function App() {
  const navigation = useNavigation<WelcomeNavigationProps['navigation']>();
  const { colors }: Theme = useTheme();
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Wrapper showBack={false} onBackPress={goBack}>
      {() => {
        return (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                marginTop: 205,
              }}>
              <MyTitle
                text={`Welcome to `}
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: '400',
                }}
              />
              <MyTitle
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: '700',
                }}
                text={`Smart Masjid`}
              />
            </View>
            <GapView length={85} />
            <MyText
              size={16}
              textStyle={{ textAlign: 'center' }}
              text="Have you purchased the device ?"
            />
            <GapView length={80} />
            <Joined
              containerStyle={{ alignSelf: 'center' }}
              onPress1={() => {}}
              onPress2={() => navigation.navigate('USetup', { type: 'setup' })}
            />
            <GapView length={80} />
            <MyText
              text="I already have an account."
              onPress={() => navigation.navigate('USetup', { type: 'login' })}
              pressable
              textStyle={{
                fontSize: 16,
                textAlign: 'center',
                color: colors.primary,
              }}
            />
          </ScrollView>
        );
      }}
    </Wrapper>
  );
}
