import React, { useMemo } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import { Rounded } from '../Buttons';
import MyText from '../MyText';
import GapView from '../GapView';

export default function ErrorModal({
  visible,
  onClose,
  message = '',
  options,
}: {
  visible: boolean;
  onClose?: () => void;
  options?: {
    label: string;
    onPress?: () => void;
  }[];
  message: string;
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
        <View style={styles.body}>
          <MyText text="Wi-Fi Error" textStyle={styles.label} size={16} />
          <GapView length={20} />
          <MyText text={message} textStyle={styles.bodyText} size={16} />
          <View style={{ flexDirection: 'row' }}>
            <MyText
              text={'Note: Device must be '}
              textStyle={styles.noteText}
              size={16}
            />
            <MyText
              text={'powered on'}
              textStyle={{ ...styles.noteText, fontWeight: '800' }}
              size={16}
            />
          </View>
          <GapView length={30} />
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            {options?.map(item => (
              <View
                key={item.label}
                style={{ width: '100%', alignItems: 'center' }}>
                <Rounded
                  label={item?.label}
                  onPress={item?.onPress}
                  width={'100%'}
                />
                <GapView length={15} />
              </View>
            ))}
            <Rounded
              label={"No, I'm good"}
              onPress={onClose}
              outlined
              width={'100%'}
            />
          </View>
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
  });
};
