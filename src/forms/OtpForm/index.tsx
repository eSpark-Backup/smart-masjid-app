import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  GapView,
  MyText,
  MyTextSubHeader,
  MyTitle,
  OverlayLoader,
  Rounded,
} from '../../components';
import { MyLightTheme } from '../../theme';
import { Theme, useTheme } from '@react-navigation/native';
import CountDown from 'react-native-countdown-component';
import { CreateUserRequest } from '../../types/userControllerApiResponse';
import { WINDOW_WIDTH } from '../../constants';

export default function OtpForm({
  type,
  setStep,
  title = 'OTP Form',
  onResend,
  contentOpacity = 0,
  userEmail,
  userPhone,
  goBack,
}: {
  type?: 'login' | 'setup';
  setStep: (value: string) => void;
  title?: string;
  onResend?: () => Promise<void>;
  contentOpacity?: any;
  userEmail?: string;
  userPhone?: string;
  goBack?: () => void;
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
    const res = await onResend?.();
    setTime((prevVal: number) => 300);
    setCountdownId(new Date().getTime().toString());
    setExpTime(false);
    setLoader(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top:
            Platform.OS == 'ios'
              ? -WINDOW_WIDTH / 1.6 / 3
              : -WINDOW_WIDTH / 1.9 / 3,
        }}>
        <Animated.View style={[{ opacity: contentOpacity }]}>
          <MyTitle text={title} />
        </Animated.View>
      </View>
      <GapView />
      <View style={{ alignItems: 'center' }}>
        <OverlayLoader isShow={loader} />
        <MyTextSubHeader text="One-time passcode sent to email" />
        <GapView length={10} />
        <MyText
          text={userPhone ?? userEmail ?? ''}
          size={14}
          textStyle={{ fontWeight: '400', color: '#6E6E6E' }}
        />
        <GapView length={10} />
        <TouchableOpacity onPress={goBack}>
          <MyText
            text={`Use a different ${userEmail ? 'email?' : 'number?'}`}
            size={16}
            textStyle={{ fontWeight: '400', color: colors.primary }}
          />
        </TouchableOpacity>
        <GapView length={30} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MyText
            text="Resend code in"
            size={16}
            textStyle={{ fontWeight: '400' }}
          />
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
            size={10}
            showSeparator
            separatorStyle={{ color: colors.primary, fontSize: 15 }}
            timeToShow={['M', 'S']}
            timeLabels={{ m: '', s: '' }}
            digitStyle={{ marginHorizontal: 1 }}
            digitTxtStyle={{
              fontSize: 16,
              fontWeight: '400',
              color: '#000',
            }}
          />
        </View>
        <GapView length={10} />
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
          codeInputFieldStyle={{
            ...styles.underlineStyleBase,
            borderColor: colors.primary,
          }}
          codeInputHighlightStyle={{ borderColor: colors.primary }}
          onCodeFilled={code => {
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />
        <View style={{ marginTop: 30, marginBottom: 30 }}>
          <Rounded label="Next" width={250} onPress={() => setStep(otp)} />
        </View>
        <TouchableOpacity disabled={!expTime} onPress={onResendOtp}>
          <MyText
            text="Resend Code"
            textStyle={{
              fontSize: 16,
              fontWeight: '400',
              color: expTime ? colors.primary : '#6e6e6e',
              opacity: !expTime ? 0.6 : 1,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  underlineStyleBase: {
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
    fontSize: 16,
  },
});
