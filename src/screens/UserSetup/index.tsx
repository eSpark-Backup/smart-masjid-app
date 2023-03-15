import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { EmailForm, OtpForm, PhoneForm, PersonalInfoForm } from '../../forms';
import { RootStackParamList } from '../../types';
import { MyToast, SLoader } from '../../components';

type USetupNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'USetup'
>;

export default function UserSetupScreen() {
  const navigation = useNavigation<USetupNavigationProps['navigation']>();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    console.log('step current?', step);
    if (step == 4) {
      setTimeout(() => {
        setStep(step + 1);
      }, 3000);
    }
  }, [step]);

  const handleBack = () => {
    if (step !== 1) {
      return step - 1;
    }
    return 1;
  };

  return (
    <Wrapper onBackPress={() => !disable && setStep(handleBack)}>
      <ScrollView>
        {step == 1 && <EmailForm setStep={(value: number) => setStep(value)} />}
        {step == 1.1 && (
          <PhoneForm setStep={(value: number) => setStep(value)} />
        )}
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
        {step == 5 && (
          <MyToast
            isSuccess={true}
            onPress={() => navigation.navigate('DSetup')}
            btnText={'Connect A Device'}
            title="Congratulations!"
            message={
              'Your account has been created.' +
              '\n' +
              'Lets setup your device.' +
              '\n' +
              '\n' +
              'Make sure you power on your device and turn on bluetooth on your phone.'
            }
          />
        )}
      </ScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
