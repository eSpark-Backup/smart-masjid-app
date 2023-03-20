import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme, useTheme } from '@react-navigation/native';

import { GradientColors } from '../../../theme';
import { WINDOW_WIDTH } from '../../../constants';
import GapView from '../../GapView';

interface JoinedButtonType {
  title1?: string;
  title2?: string;
  onPress1?: () => void;
  onPress2?: () => void;
  containerStyle?: ViewStyle;
  activeButton?: 'one' | 'two';
}

export default function Joined({
  title1 = 'No',
  title2 = 'Yes',
  onPress1 = (): void => console.log('title1'),
  onPress2 = (): void => console.log('title2'),
  containerStyle = {},
  activeButton = 'two',
}: JoinedButtonType) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <TouchableWithoutFeedback onPress={onPress1}>
        {activeButton == 'one' ? (
          <LinearGradient
            colors={activeButton == 'one' ? GradientColors : ['#fff', '#fff']}
            style={activeButton == 'one' ? styles.gradient : styles.hollowLeft}>
            <Text
              style={activeButton == 'one' ? styles.activeText : styles.text}>
              {title1}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.hollowLeft}>
            <Text style={styles.text}>{title1}</Text>
          </View>
        )}
      </TouchableWithoutFeedback>
      <GapView mode='horizontal' />
      <TouchableWithoutFeedback onPress={onPress2}>
        {activeButton == 'two' ? (
          <LinearGradient
            colors={activeButton == 'two' ? GradientColors : ['#fff', '#fff']}
            style={
              activeButton == 'two' ? styles.rightGradient : styles.hollow
            }>
            <Text
              style={activeButton == 'two' ? styles.activeText : styles.text}>
              {title2}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.hollow}>
            <Text style={styles.text}>{title2}</Text>
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      // backgroundColor: 'red'
    },
    text: {
      fontSize: 18,
      color: colors.primary,
    },
    activeText: {
      fontSize: 18,
      color: '#fff',
    },
    gradient: {
      borderRadius: 20,
      height: 41,
      width: WINDOW_WIDTH / 2 - 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightGradient: {
      borderRadius: 20,
      height: 41,
      width: WINDOW_WIDTH / 2 - 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hollow: {
      borderRadius: 20,
      height: 41,
      width: WINDOW_WIDTH / 2 - 40,
      borderWidth: 1.5,
      right: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hollowLeft: {
      borderRadius: 20,
      height: 41,
      width: WINDOW_WIDTH / 2 - 40,
      borderWidth: 2,
      left: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
