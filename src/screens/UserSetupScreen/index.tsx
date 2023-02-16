import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { EmailForm } from '../../forms';
import { RootStackParamList } from '../../types';

type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'USetup'
>;

export default function UserSetupScreen() {
  const navigation = useNavigation();

  return (
    <Wrapper>
      <EmailForm />
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
