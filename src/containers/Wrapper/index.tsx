import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Animated,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

import { HeaderBackgroundImage, HeaderIOSBackgroundImage } from '../../assets';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import Header from '../../components/Header';
import MyText from '../../components/MyText';
import { GapView, TextLabel } from '../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Wrap you screen code in Wrapper Component
// Like This <Wrapper><YOUR_COMPONENT><YOUR_COMPONENT/></Wrapper>
export default function Wrapper({
  children,
  showFooter = false,
  onBackPress,
  bgImageSpacer = true,
  showBack = true,
  title = '',
}: {
  children: ({
    props,
  }: {
    props: {
      contentOpacity: Animated.AnimatedInterpolation<string | number> | number;
    };
  }) => React.ReactNode;
  showFooter?: boolean;
  onBackPress?: () => void;
  bgImageSpacer?: boolean;
  showBack?: boolean;
  title?: string;
}) {
  const [toggle, setToggle] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [1, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: Platform.OS == 'ios' ? useSafeAreaInsets().top : 10,
            left: WINDOW_WIDTH / 8,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            width: '75%',
            alignSelf: 'center',
          },
          { opacity: headerOpacity },
        ]}>
        <TextLabel label={title} textStyle={{ color: '#fff' }} />
      </Animated.View>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={styles.imageBackgroundStyle}
            imageStyle={styles.imageStyle}
            source={
              Platform.OS == 'ios'
                ? HeaderIOSBackgroundImage
                : HeaderBackgroundImage
            }>
            <Header onBackPress={onBackPress} showBack={showBack} />
            <ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ zIndex: -1 }}>
              <>
                <GapView
                  length={
                    Platform.OS == 'ios'
                      ? WINDOW_WIDTH / 1.6
                      : WINDOW_WIDTH / 1.9
                  }
                />
                {children({ props: { contentOpacity: contentOpacity } })}
              </>
            </ScrollView>
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
      {/* </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  imageBackgroundStyle: { minHeight: WINDOW_WIDTH / 1.8, flex: 1 },
  imageStyle: {
    height: Platform.OS == 'ios' ? WINDOW_WIDTH / 1.6 : WINDOW_WIDTH / 1.9,
    width: WINDOW_WIDTH,
  },
});
