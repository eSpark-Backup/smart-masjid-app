import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { DeviceSelectForm, WifiSelectForm, PasswordForm } from '../../forms';
import { RootStackParamList } from '../../types';
import { DLoader, MyToast, SLoader } from '../../components';

type DSetupNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'DSetup'
>;

export default function DeviceSetupScreen() {
  const navigation = useNavigation<DSetupNavigationProps['navigation']>();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);
  const startValue = useRef(new Animated.Value(0)).current;
  const endValue = 1;

  useEffect(() => {
    if(step == 6) {
      Animated.spring(startValue, {
        toValue: endValue,
        friction: 3,
        useNativeDriver: true,
        tension: 10,
      }).start();
    }
  }, [step]);

  useEffect(() => {
    console.log('step current?', step);
    if (step == 1 || step == 5) {
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
      {step == 1 && <DLoader />}
      {step == 2 && (
        <DeviceSelectForm setStep={(value: number) => setStep(value)} />
      )}
      {step == 3 && (
        <WifiSelectForm setStep={(value: number) => setStep(value)} />
      )}
      {step == 4 && (
        <PasswordForm setStep={(value: number) => setStep(value)} />
      )}
      {step == 5 && (
        <SLoader
          // title="Creating Account"
          message="Connecting to wifi network"
        />
      )}
      {step == 6 && (
        <Animated.View
          style={[
            {
              transform: [
                {
                  scale: startValue,
                },
              ],
            },
          ]}>
          <MyToast
            isSuccess={true}
            btnText={"Let's Go"}
            title="Yay"
            message={`Your device is connected successfully.\nLets subscribe to a masjid now.`}
          />
        </Animated.View>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
