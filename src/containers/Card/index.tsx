import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { WINDOW_WIDTH } from '../../constants';

interface CardProps {
  children?: React.ReactNode;
  height?: number | undefined;
  width?: number;
  radius?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}
export default function Card(props: CardProps) {
  const { children, height = undefined, width, radius = 12 } = props;

  const styles = makeStyles(props);
  return (
    <View style={[styles.mainContainer, props.style]}>
      <View
        style={{
          width: props?.width ?? WINDOW_WIDTH - 28,
          height: height,
          borderRadius: radius,
        }}>
        {children}
      </View>
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
      backgroundColor: props?.backgroundColor ?? '#F1F7F8',
      height: props.height,
    },
  });
};
