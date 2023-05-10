import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShadowFlex } from 'react-native-neomorph-shadows';

import { WINDOW_WIDTH } from '../../constants';

interface CardProps {
  children?: React.ReactNode;
  height?: number | undefined;
  width?: number;
  radius?: number;
}
export default function Card(props: CardProps) {
  const { children, height = undefined, width, radius = 12 } = props;

  const styles = makeStyles(props);
  return (
    <View style={styles.mainContainer}>
      <ShadowFlex
        style={{
          ...styles.shadowContainer,
          width: props?.width ?? WINDOW_WIDTH - 28,
          maxHeight: height,
          borderRadius: radius,
        }}>
        {children}
      </ShadowFlex>
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
      shadowOpacity: 0.09,
      shadowRadius: 10,
    },
    shadowContainer: {
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowColor: 'grey',
      shadowRadius: 6,
      borderRadius: 12,
      backgroundColor: '#fff',
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });
};
