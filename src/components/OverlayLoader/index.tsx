import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

const OverlayLoader = ({
  isShow = false,
  hideLoader = false,
  loaderColor = null,
  noBg = false,
}: {
  isShow: boolean;
  hideLoader?: boolean;
  loaderColor?: string | null;
  noBg?: boolean;
}) => {
  const { colors }: Theme = useTheme();
  return (
    <Modal statusBarTranslucent transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: noBg ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
        }}>
        {!hideLoader && (
          <ActivityIndicator
            size={'large'}
            color={loaderColor ?? colors.primary}
          />
        )}
      </View>
    </Modal>
  );
};

export default OverlayLoader;
