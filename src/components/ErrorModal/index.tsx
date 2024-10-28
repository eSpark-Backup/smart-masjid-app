import React, { useMemo } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import { Rounded } from '../Buttons';
import MyText from '../MyText';
import GapView from '../GapView';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import { CloseIcon } from '../../assets';

export default function ErrorModal({
  visible,
  onClose,
  message = '',
  message2,
  options,
  wifiError,
  title,
}: {
  visible: boolean;
  onClose?: () => void;
  options?: {
    label: string;
    onPress?: () => void;
  }[];
  message: string;
  message2?: string;
  wifiError?: boolean;
  title: string;
}): JSX.Element {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);

  return (
    <Modal
      presentationStyle="overFullScreen"
      visible={visible}
      transparent
      statusBarTranslucent>
      <View style={styles.main}>
        {/* <View style={styles.backDropContainer}>
          <TouchableOpacity
            onPress={() => console.log('pressed')}
            style={styles.backDrop}></TouchableOpacity>
        </View> */}
        <View style={styles.body}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              right: 5,
              top: 5,
            }}>
            <CloseIcon width={30} height={30} />
          </TouchableOpacity>
          <MyText text={title} textStyle={styles.label} size={16} />
          <GapView length={10} />
          <MyText text={message} textStyle={styles.bodyText} size={16} />
          <GapView length={10} />
          {!wifiError && message2 && (
            <MyText text={message2} textStyle={styles.bodyText} size={16} />
          )}
          {wifiError && (
            <View
              style={{
                flexDirection: 'row',
                ...styles.bodyText,
                paddingBottom: 0,
              }}>
              <MyText
                text={'Note: Restart your Device ( '}
                textStyle={styles.text}
                size={16}
              />
              <MyText
                size={16}
                text="Power Off"
                textStyle={{ fontFamily: 'Roboto-Bold' }}
              />
            </View>
          )}
          {wifiError && (
            <View style={{ flexDirection: 'row', ...styles.bodyText }}>
              <MyText size={16} text=" and " textStyle={styles.text} />
              <MyText
                size={16}
                text="Power On"
                textStyle={{ fontFamily: 'Roboto-Bold' }}
              />
              <MyText
                size={16}
                text=" ) before taking any action."
                textStyle={styles.text}
              />
            </View>
          )}
          <GapView length={20} />
          {options?.map(item => (
            <View key={item.label}>
              <Rounded label={item?.label} onPress={item?.onPress} />
              <GapView length={15} />
            </View>
          ))}
          {/* <Rounded label={"No, I'm good"} onPress={onClose} outlined /> */}
        </View>
      </View>
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
    },
    backDropContainer: {
      position: 'absolute',
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    backDrop: {
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
    },
    body: {
      width: '90%',
      backgroundColor: colors.background,
      borderRadius: 12,
      alignItems: 'center',
      padding: 20,
    },
    label: {
      paddingHorizontal: 27.5,
      paddingBottom: 20,
      color: '#000000',
      // fontWeight: 'bold',
      fontFamily: 'Roboto-Bold',
    },
    noteText: {
      color: '#3E3E3E',
      // fontWeight: '400',
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
    },
    bodyText: {
      paddingHorizontal: 27.5,
      paddingBottom: 20,
      color: '#3E3E3E',
      // fontWeight: '400',
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
    },
    text: {
      color: '#3E3E3E',
      // fontWeight: '400',
      fontFamily: 'Roboto-Regular',
    },
  });
};
