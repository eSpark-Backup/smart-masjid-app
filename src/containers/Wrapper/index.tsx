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
  showFooter = true,
  onBackPress,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
  onBackPress?: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.imageBackgroundStyle}
          imageStyle={styles.imageStyle}
          source={HeaderBackgroundImage}>
          <View style={{ height: 44 }} />
          <Header onBackPress={onBackPress} />
          {children}
        </ImageBackground>
        {showFooter && (
          <MyText
            text="Powered by Futurik Labs"
            size={12}
            textStyle={{ textAlign: 'center', marginBottom: 35 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackgroundStyle: { minHeight: WINDOW_HEIGHT / 3, flex: 1 },
  imageStyle: {
    height: WINDOW_HEIGHT / 3,
    width: WINDOW_WIDTH,
  },
});
