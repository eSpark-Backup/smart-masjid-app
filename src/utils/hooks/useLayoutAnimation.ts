import { LayoutAnimation, Platform, UIManager } from 'react-native';

const useLayoutAnimation = (duration?: number) => {
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

export default useLayoutAnimation;
