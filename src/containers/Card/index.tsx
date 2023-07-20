import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShadowFlex } from 'react-native-neomorph-shadows';

import { WINDOW_WIDTH } from '../../constants';

interface CardProps {
  children?: React.ReactNode;
  height?: number | undefined;
  width?: number;
  radius?: number;
  backgroundColor?: string;
}
export default function Card(props: CardProps) {
  const { children, height = undefined, width, radius = 12 } = props;

  const styles = makeStyles(props);
  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          width: props?.width ?? WINDOW_WIDTH - 28,
          maxHeight: height,
          borderRadius: radius,
        }}>
        {children}
      </View>
      {/* <ShadowFlex
        style={{
          ...styles.shadowContainer,
          width: props?.width ?? WINDOW_WIDTH - 28,
          maxHeight: height,
          borderRadius: radius,
        }}>
        {children}
      </ShadowFlex> */}
    </View>
  );
}

const makeStyles = (props: CardProps) => {
  return StyleSheet.create({
    mainContainer: {
      borderRadius: 12,
      width: props.width ?? WINDOW_WIDTH - 28,
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: props?.backgroundColor ?? '#F7F9FA',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 1,
      maxHeight: props.height,
    },
    shadowContainer: {
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowColor: 'grey',
      shadowRadius: 6,
      borderRadius: 12,
      backgroundColor: props?.backgroundColor ?? '#F7F9FA',
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });
};
