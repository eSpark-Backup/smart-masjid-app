import React, { useMemo } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import MyText from '../MyText';
import GapView from '../GapView';
import MyTextSubHeader from '../MyTextSubHeader';
import { Check, CloseIcon } from '../../assets';

export default function PossibleCauseErrorModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose?: () => void;
}): JSX.Element {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);

  const causes = [
    'Device is powered off. Please charge and power on the device.',
    'Device not in WiFi range. Please bring the device within WiFi range.',
    'Internet outage. WiFi working now. Please power off and power on device.',
    'WiFi password changed. Please tap error icon on WiFi to update new password.',
    'WiFi network changed. Please tap error icon on WiFi to setup new connection.',
  ];

  return (
    <Modal
      presentationStyle="overFullScreen"
      visible={visible}
      transparent
      statusBarTranslucent>
      <View style={styles.main}>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={onClose}
            style={{ position: 'absolute', right: 5, top: 5 }}>
            <CloseIcon width={30} height={30} />
          </TouchableOpacity>
          <MyText text="Device Offline" textStyle={styles.label} size={16} />
          <GapView length={20} />
          <View style={{ width: '100%' }}>
            <MyTextSubHeader
              text={'Possible Causes'}
              style={styles.subHeading}
            />
            <GapView length={10} />
            {causes.map((item: string, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: 5,
                }}>
                <Check style={{ marginTop: 1 }} width={14} height={14} />
                <MyText text={item} textStyle={styles.content} size={12} />
              </View>
            ))}
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
      width: '85%',
      backgroundColor: colors.background,
      borderRadius: 12,
      alignItems: 'center',
      padding: 20,
    },
    label: {
      paddingHorizontal: 27.5,
      color: '#000000',
      fontWeight: 'bold',
    },
    content: {
      paddingHorizontal: 8,
      width: 280,
    },
    subHeading: {
      color: '#0e0e0e',
      fontSize: 12,
    },
  });
};
