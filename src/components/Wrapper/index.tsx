import React from 'react';
import { View, ImageBackground, StatusBar, Text } from 'react-native';
import { HeaderBackgroundImage } from '../../assets';
import { styles } from './style';

// Wrap you screen code in Wrapper Component
// Like This <Wrapper><YOUR_COMPONENT><YOUR_COMPONENT/></Wrapper>
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.imageBackgroundStyle}
          imageStyle={styles.imageStyle}
          source={HeaderBackgroundImage}>
          <View style={{ height: StatusBar.currentHeight }} />
          <Text>
            Voluptate incididunt nostrud incididunt non aliqua anim magna
            pariatur mollit ea.
          </Text>
          {children}
        </ImageBackground>
      </View>
    </View>
  );
};

export default Wrapper;
