import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';

export const styles = StyleSheet.create({
  imageBackgroundStyle: { minHeight: WINDOW_HEIGHT / 3, flex: 1 },
  imageStyle: {
    height: WINDOW_HEIGHT / 3,
    width: WINDOW_WIDTH,
  },
});
