import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { EmailForm, OtpForm, PhoneForm, PersonalInfoForm } from '../../forms';
import { RootStackParamList } from '../../types';
import { SLoader } from '../../components';

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
      {step == 2 && <OtpForm setStep={(value: number) => setStep(value)} />}
      {step == 3 && (
        <PersonalInfoForm setStep={(value: number) => setStep(value)} />
      )}
      {step == 4 && (
        <SLoader
          title="Creating Account"
          message="Your account will be ready soon."
        />
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
