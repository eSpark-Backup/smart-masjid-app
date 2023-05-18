import React from 'react';
import { View, ImageBackground, StatusBar, StyleSheet } from 'react-native';

import { HeaderBackgroundImage } from '../../assets';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import Header from '../../components/Header';
import MyText from '../../components/MyText';

// Wrap you screen code in Wrapper Component
// Like This <Wrapper><YOUR_COMPONENT><YOUR_COMPONENT/></Wrapper>
export default function Wrapper({
  children,
  showFooter = false,
  onBackPress,
  bgImageSpacer = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
  onBackPress?: () => void;
  bgImageSpacer?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.imageBackgroundStyle}
          imageStyle={styles.imageStyle}
          source={HeaderBackgroundImage}>
          <View style={{ height: WINDOW_WIDTH / 10 }} />
          <Header onBackPress={onBackPress} />
          {bgImageSpacer && (
            <View
              style={{
                height: WINDOW_WIDTH / 3.5,
              }}
            />
          )}
          {children}
        </ImageBackground>
        {showFooter && (
          <MyText
            text="Powered by Futurik Labs"
            size={12}
            textStyle={{ textAlign: 'center', marginVertical: 35 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackgroundStyle: { minHeight: WINDOW_WIDTH / 1.8, flex: 1 },
  imageStyle: {
    height: WINDOW_WIDTH / 1.8,
    width: WINDOW_WIDTH,
  },
});
