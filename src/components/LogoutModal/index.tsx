import React, { useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { Joined } from '../Buttons';
import MyText from '../MyText';
import GapView from '../GapView';

export default function LogoutModal({
  visible,
  onClose,
  onAllowed,
}: {
  visible: boolean;
  onClose?: () => void;
  onAllowed?: () => void;
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
          <MyText text="Attention" textStyle={styles.label} size={16} />
          <GapView length={50} />
          <MyText
            text={`Do you wish to logout?`}
            textStyle={styles.bodyText}
            size={16}
          />
          <GapView length={50} />
          <Joined activeButton="two" onPress2={onClose} onPress1={onAllowed} />
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
      color: '#FF6464',
      fontWeight: '500',
    },
    bodyText: {
      paddingHorizontal: 27.5,
      paddingBottom: 20,
      color: '#3E3E3E',
      fontWeight: '400',
      textAlign: 'center',
    },
  });
};
