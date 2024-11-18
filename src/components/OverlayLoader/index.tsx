import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import MyText from '../MyText';
import GapView from '../GapView';
import BlurBackground from '../BlurBackground';
import { BlurView } from '@react-native-community/blur';

const OverlayLoader = ({
  isShow = false,
  hideLoader = false,
  loaderColor = null,
  noBg = false,
  msg,
}: {
  isShow: boolean;
  hideLoader?: boolean;
  loaderColor?: string | null;
  noBg?: boolean;
  msg?: string;
}) => {
  const { colors }: Theme = useTheme();
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: noBg ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        display: isShow ? 'flex' : 'none',
      }}>
      {!hideLoader && (
        <View style={{ zIndex: 1 }}>
          <ActivityIndicator
            size={'large'}
            color={loaderColor ?? colors.primary}
          />
        </View>
      )}
      {msg && (
        <View style={{ zIndex: 1 }}>
          <GapView length={20} />
          <MyText size={16} text={msg} />
        </View>
      )}
      {msg ? (
        <BlurView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
      ) : null}
    </View>
  );
};

export default OverlayLoader;
