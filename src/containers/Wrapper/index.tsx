import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  Image,
  StatusBar,
  Easing,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  HeaderAndroidBackgroundImage,
  HeaderAndroidBackgroundImageUp,
  HeaderBackgroundImage,
  HeaderIOSBackgroundImage,
  HeaderIOSBackgroundImageUp,
} from '../../assets';
import { WINDOW_WIDTH } from '../../constants';
import Header from '../../components/Header';
import MyText from '../../components/MyText';
import { GapView, MyTitle, TextLabel } from '../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -WINDOW_WIDTH / 1.7],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Animated.View
        style={[
          {
            position: 'absolute',
            top:
              Platform.OS == 'ios'
                ? useSafeAreaInsets().top
                : useSafeAreaInsets().top + 5,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            width: '75%',
            alignSelf: 'center',
          },
          { opacity: headerOpacity },
        ]}>
        <MyTitle text={title} style={{ color: '#fff' }} />
      </Animated.View>

      <View
        style={{ flex: 1 }}
        // onPress={onBackDropPress}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.imageBackgroundStyle}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  alignSelf: 'center',
                },
                { transform: [{ translateY: contentOpacity }] },
              ]}>
              <Image
                style={styles.imageStyle}
                source={
                  Platform.OS == 'ios'
                    ? HeaderIOSBackgroundImage
                    : HeaderAndroidBackgroundImage
                }
              />
            </Animated.View>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  alignSelf: 'center',
                },
                { opacity: headerOpacity },
              ]}>
              <Image
                style={{
                  height:
                    Platform.OS == 'ios'
                      ? WINDOW_WIDTH / 4.6
                      : WINDOW_WIDTH / 5.5,
                  width: WINDOW_WIDTH,
                }}
                source={
                  Platform.OS == 'ios'
                    ? HeaderIOSBackgroundImageUp
                    : HeaderAndroidBackgroundImageUp
                }
              />
            </Animated.View>
            {/* <ImageBackground
              style={styles.imageBackgroundStyle}
              imageStyle={styles.imageStyle}
              source={
                Platform.OS == 'ios'
                  ? HeaderIOSBackgroundImage
                  : HeaderBackgroundImage
              }> */}
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
                      : WINDOW_WIDTH / 1.74
                  }
                />
                {children({ props: { contentOpacity: titleOpacity } })}
              </>
            </ScrollView>
            {/* </ImageBackground> */}
          </View>

          {showFooter && (
            <MyText
              text="Powered by Futurik Labs"
              size={12}
              textStyle={{ textAlign: 'center', marginVertical: 35 }}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageBackgroundStyle: { minHeight: WINDOW_WIDTH / 1.8, flex: 1 },
  imageStyle: {
    height: Platform.OS == 'ios' ? WINDOW_WIDTH / 1.6 : WINDOW_WIDTH / 1.74,
    width: WINDOW_WIDTH,
  },
});
