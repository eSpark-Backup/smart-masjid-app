import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  GapView,
  MyText,
  OverlayLoader,
  Rounded,
  TextLabel,
} from '../../components';
import { MyLightTheme } from '../../theme';
import { Theme, useTheme } from '@react-navigation/native';
import CountDown from 'react-native-countdown-component';

export default function OtpForm({
  type,
  setStep,
  title = 'OTP Form',
  onResend = async () => {},
}: {
  type?: 'login' | 'setup';
  setStep: (value: string) => void;
  title?: string;
  onResend?: () => Promise<undefined>;
}) {
  const otpRef: any = useRef(null);
  const { colors }: Theme = useTheme();
  const [otp, setOtp] = React.useState('');
  const [expTime, setExpTime] = React.useState(false);
  const [time, setTime] = React.useState(300);
  const [loader, setLoader] = React.useState(false);
  const [countdownId, setCountdownId] = React.useState(
    new Date().getTime().toString(),
  );

  const onResendOtp = async () => {
    setLoader(true);
    const res = await onResend();
    setTime((prevVal: number) => 300);
    setCountdownId(new Date().getTime().toString());
    setExpTime(false);
    setLoader(false);
  };

  return (
    <View style={styles.container}>
      <GapView length={20} />
      <TextLabel label={title} textStyle={{ alignSelf: 'center' }} />
      <GapView length={40} />
      <OverlayLoader isShow={loader} />
      <MyText
        text="You'll recieve a verification code shortly"
        textStyle={{ fontSize: 16, fontWeight: '400' }}
      />
      <GapView length={40} />
      {/* <MyText text="0:45" textStyle={{ fontSize: 16, fontWeight: '400' }} /> */}
      <CountDown
        id={countdownId}
        until={time}
        onFinish={() => {
          setExpTime(true);
        }}
        onChange={(until: number) => {
          if (until == 180) {
            setExpTime(true);
          }
        }}
        size={12}
        showSeparator
        separatorStyle={{ color: colors.primary, fontSize: 15 }}
        timeToShow={['M', 'S']}
        timeLabels={{ m: '', s: '' }}
        digitStyle={{ marginHorizontal: 5 }}
        digitTxtStyle={{ fontSize: 16, fontWeight: '400', color: '#000' }}
      />
      <GapView length={40} />
      <OTPInputView
        ref={otpRef}
        style={{
          width: '80%',
          height: 50,
          paddingLeft: 15,
        }}
        pinCount={6}
        editable
        autoFocusOnLoad={false}
        // secureTextEntry
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        onCodeChanged={code => setOtp(code)}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          console.log(`Code is ${code}, you are good to go!`);
        }}
      />
      <View style={{ marginTop: 40, marginBottom: 40 }}>
        <Rounded label="Next" width={250} onPress={() => setStep(otp)} />
      </View>
      <TouchableOpacity disabled={!expTime} onPress={onResendOtp}>
        <MyText
          text="Resend Code"
          textStyle={{
            fontSize: 16,
            fontWeight: '400',
            color: colors.primary,
            opacity: !expTime ? 0.5 : 1,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  borderStyleHighLighted: {
    borderColor: '#9fc7c9',
  },
  underlineStyleBase: {
    borderWidth: 0,
    borderBottomWidth: 2,
    color: 'black',
    fontSize: 16,
    borderColor: '#9fc7c9',
  },

  underlineStyleHighLighted: {
    borderColor: '#9fc7c9',
  },
});
