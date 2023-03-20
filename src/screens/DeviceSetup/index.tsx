import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import {
  DeviceSelectForm,
  WifiSelectForm,
  PasswordForm,
  DeviceNicknameForm,
} from '../../forms';
import { BottomNavigationParamList, RootStackParamList } from '../../types';
import { DLoader, MyToast, SLoader } from '../../components';

type DSetupNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'DSetup'
>;

export default function DeviceSetupScreen() {
  const navigation: any = useNavigation<DSetupNavigationProps['navigation']>();
  const route: any = useRoute();
  const isFocused = useIsFocused();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setStep(1);
  }, [isFocused]);

  useEffect(() => {
    console.log('step current?', step);
    if (step == 1 || step == 6) {
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
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {step == 1 && <DLoader />}
        {step == 2 && (
          <DeviceSelectForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 3 && (
          <DeviceNicknameForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 4 && (
          <WifiSelectForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 5 && (
          <PasswordForm setStep={(value: number) => setStep(value)} />
        )}
        {step == 6 && (
          <SLoader title="Connecting" message="Connecting to wifi network" />
        )}
        {step == 7 && (
          <MyToast
            isSuccess={true}
            btnText={route.params?.from ? 'Awesome' : 'Search Masjid'}
            onPress={() =>
              navigation.navigate('HomeBottomTab', {
                screen: route.params?.from ? 'Device' : 'Home',
              })
            }
            title="Device setup complete!"
            message={`Your device is connected successfully.${
              !route.params?.from && '\n \nLets subscribe to a masjid now.'
            }`}
          />
        )}
      </ScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
