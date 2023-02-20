import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import { GapView, MyText, Rounded } from '../../components';
import { MyLightTheme } from '../../theme';

export default function OtpForm({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const otpRef: any = useRef(null);

  return (
    <View style={styles.container}>
      <MyText
        text="You'll recieve a verification code shortly"
        textStyle={{ fontSize: 16, fontWeight: '400' }}
      />
      <GapView length={40} />
      <MyText text="0:45" textStyle={{ fontSize: 16, fontWeight: '400' }} />
      <GapView length={40} />
      <OTPInputView
        ref={otpRef}
        style={{
          width: '60%',
          height: 50,
          paddingLeft: 15,
        }}
        pinCount={4}
        editable
        autoFocusOnLoad={false}
        // secureTextEntry
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          console.log(`Code is ${code}, you are good to go!`);
        }}
      />
      <View style={{ marginTop: 60, marginBottom: 40 }}>
        <Rounded label="Next" width={250} onPress={() => setStep(3)} />
      </View>
      <MyText
        text="Resend Code"
        pressable
        textStyle={{ fontSize: 16, fontWeight: '400' }}
        onPress={() => console.log('ref')}
      />
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
