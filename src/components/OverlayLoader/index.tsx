import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import MyText from '../MyText';
import GapView from '../GapView';

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
        <ActivityIndicator
          size={'large'}
          color={loaderColor ?? colors.primary}
        />
      )}
      {msg && (
        <>
          <GapView length={20} />
          <MyText size={16} text={msg} />
        </>
      )}
    </View>
  );
};

export default OverlayLoader;
