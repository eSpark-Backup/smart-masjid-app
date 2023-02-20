import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { EmailForm, PhoneForm } from '../../forms';
import { RootStackParamList } from '../../types';

type WelcomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'USetup'
>;

export default function UserSetupScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    console.log('step current?', step);
  }, [step]);

  const handleBack = () => {
    if (step !== 1) {
      return step - 1;
    }
    return 1;
  };

  return (
    <Wrapper onBackPress={() => !disable && setStep(handleBack)}>
      {step == 1 && <EmailForm setStep={(value: number) => setStep(value)} />}
      {step == 1.1 && <PhoneForm setStep={(value: number) => setStep(value)} />}
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
