import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Wrapper } from '../../containers';
import { EmailForm, OtpForm, PhoneForm, PersonalInfoForm } from '../../forms';
import { RootStackParamList } from '../../types';
import { MyToast, SLoader } from '../../components';
import { CreateUser } from '../../api/userController';

type Props = NativeStackScreenProps<RootStackParamList, 'USetup'>;

export default function UserSetupScreen() {
  const navigation = useNavigation<Props['navigation']>();
  const route = useRoute<Props['route']>();
  const [step, setStep] = useState(1);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState<any>({
    firstName: 'string',
    lastName: 'string',
    userType: 'Customer',
  });

  console.log('route params', route.params?.type);

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

  const onSubmit = async (dataObj: any) => {
    setStep(4);
    await CreateUser(dataObj);
    setStep(5);
  };

  return (
    <Wrapper onBackPress={() => !disable && setStep(handleBack)}>
      <ScrollView>
        {step == 1 && (
          <EmailForm
            type={route.params?.type}
            setStep={values => {
              setData({ ...data, ...values });
              setStep(3);
            }}
          />
        )}
        {step == 1.1 && (
          <PhoneForm
            type={route.params?.type}
            setStep={(value: number) => setStep(3)}
          />
        )}
        {step == 2 && (
          <OtpForm
            type={route.params?.type}
            setStep={(value: number) => setStep(value)}
          />
        )}
        {step == 3 && (
          <PersonalInfoForm
            setStep={values => {
              setData({ ...data, ...values });
              onSubmit({ ...data, ...values });
            }}
          />
        )}
        {step == 4 && (
          <SLoader
            title={
              route.params?.type == 'login' ? 'Loggin In' : 'Creating Account'
            }
            message={
              route.params?.type == 'login'
                ? 'Logging into the System.'
                : 'Your account will be ready soon.'
            }
          />
        )}
        {step == 5 && (
          <MyToast
            isSuccess={true}
            onPress={() => navigation.navigate('DSetup')}
            btnText={'Connect Device'}
            title="You’re all set!"
            message={
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
