import {UIManager} from 'react-native';
import {Platform} from 'react-native';
import {LayoutAnimation, LayoutAnimationConfig} from 'react-native';

export const useLayoutAnimation = (duration?: number) => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  LayoutAnimation.configureNext({
    duration: duration ? duration : 300,
    create: {
      type: 'easeInEaseOut',
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: 'easeInEaseOut',
    },
  });
  return true;
};