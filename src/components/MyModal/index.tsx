import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import { Joined, Rounded } from '../Buttons';
import MyText from '../MyText';
import GapView from '../GapView';
import MyInput from '../MyInput';
import { WINDOW_WIDTH } from '../../constants';

export default function MyModal({
  visible,
  onSend,
  message = '',
  title1,
  onBackDropPress,
}: {
  visible: boolean;
  onSend: (text: string) => void;
  message: string;
  title1?: string;
  onBackDropPress?: () => void;
}): JSX.Element {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);
  const [showInput, setShowInput] = useState(false);
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState('');

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkEmailAndSend = () => {
    if (showInput && !email.match(EMAIL_REGEX)) {
      setShowError(true);
    } else {
      setShowError(false);
      setShowInput(false);
      setEmail('');
      onSend(email.toLowerCase());
    }
  };

  return (
    <Modal
      presentationStyle="overFullScreen"
      visible={visible}
      transparent
      statusBarTranslucent>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onBackDropPress}
        style={styles.main}>
        <TouchableOpacity activeOpacity={1} style={styles.body}>
          <MyText text="Confirm" textStyle={styles.label} size={16} />
          <GapView length={40} />
          <MyText text={message} textStyle={styles.bodyText} size={16} />

          {showInput ? (
            <>
              <GapView />
              <MyInput
                placeholder="Email"
                inputStyle={{ width: WINDOW_WIDTH - 80 }}
                value={email}
                onChangeText={text => setEmail(text)}
              />
              {showError ? (
                <View style={{ width: '90%' }}>
                  <GapView length={5} />
                  <MyText text="Invalid email" textStyle={{ color: 'red' }} />
                </View>
              ) : null}
            </>
          ) : null}
          <GapView />
          <TouchableOpacity
            onPress={() => {
              if (showInput) {
                setShowInput(false);
                setEmail('');
              } else {
                setShowInput(true);
              }
            }}>
            <MyText
              text={showInput ? 'Cancel' : 'Add additional email'}
              textStyle={{ ...styles.bodyText, color: theme.colors.primary }}
              size={16}
            />
          </TouchableOpacity>
          <GapView length={40} />
          <Rounded label={title1!} onPress={checkEmailAndSend} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const makeStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    main: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000a5',
      zIndex: 0,
    },
    body: {
      width: '90%',
      backgroundColor: colors.background,
      borderRadius: 12,
      alignItems: 'center',
      padding: 20,
      zIndex: 2,
    },
    label: {
      paddingHorizontal: 27.5,
      color: '#000000',
      // fontWeight: 'bold',
      fontFamily: 'Roboto-Medium',
    },
    bodyText: {
      paddingHorizontal: 27.5,
      color: '#3E3E3E',
      // fontWeight: '400',
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
    },
  });
};
