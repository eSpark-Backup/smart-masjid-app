import { BlurView } from '@react-native-community/blur';
import React from 'react';

const BlurBackground = ({ show }: { show: boolean }) => {
  return show ? (
    <BlurView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      blurType="light"
      blurAmount={5}
      reducedTransparencyFallbackColor="white"
    />
  ) : null;
};

export default BlurBackground;
