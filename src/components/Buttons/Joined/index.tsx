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

interface JoinedButtonType {
  title1?: string;
  title2?: string;
  onPress1?: () => void;
  onPress2?: () => void;
  containerStyle?: ViewStyle;
  activeButton?: 'one' | 'two';
}

export default function Joined({
  title1 = 'Yes',
  title2 = 'No',
  onPress1 = (): void => console.log('title1'),
  onPress2 = (): void => console.log('title2'),
  containerStyle = {},
  activeButton = 'one',
}: JoinedButtonType) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), []);

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <TouchableWithoutFeedback onPress={onPress1}>
        <LinearGradient
          colors={activeButton == 'one' ? GradientColors : ['#fff', '#fff']}
          style={activeButton == 'one' ? styles.gradient : styles.hollowLeft}>
          <Text style={activeButton == 'one' ? styles.activeText : styles.text}>
            {title1}
          </Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onPress2}>
        <LinearGradient
          colors={activeButton == 'two' ? GradientColors : ['#fff', '#fff']}
          style={activeButton == 'two' ? styles.rightGradient : styles.hollow}>
          <Text style={activeButton == 'two' ? styles.activeText : styles.text}>
            {title2}
          </Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    text: {
      paddingVertical: 17,
      paddingHorizontal: 50,
      fontSize: 18,
      color: colors.primary,
    },
    activeText: {
      paddingVertical: 17,
      paddingHorizontal: 50,
      fontSize: 18,
      color: '#fff',
    },
    gradient: {
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    rightGradient: {
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    hollow: {
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderWidth: 1.5,
      right: 1,
      borderColor: colors.primary,
    },
    hollowLeft: {
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      borderWidth: 2,
      left: 1.5,
      borderColor: colors.primary,
    },
  });
};
