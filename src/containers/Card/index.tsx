import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShadowFlex } from 'react-native-neomorph-shadows';
import { WINDOW_WIDTH } from '../../constants';

export default function Card({
  children,
  height=undefined,
  width=WINDOW_WIDTH - 45,
  radius=12
}: {
  children?: React.ReactNode;
  height?: number | undefined;
  width?: number;
  radius?: number
}) {
  return (
    <View style={styles.mainContainer}>
      <ShadowFlex
        style={{
          ...styles.shadowContainer,
          width: width,
          height: height,
          borderRadius: radius
        }}>
        {children}
      </ShadowFlex>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 12,
    width: WINDOW_WIDTH - 45,
    alignItems: 'center',
    alignSelf: 'center',
  },
  shadowContainer: {
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowColor: 'grey',
    shadowRadius: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
