import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, BackHandler } from 'react-native';

import MyText from '../MyText';
import { Theme, useTheme } from '@react-navigation/native';

export default function NoInternetModal({ isVisible }: { isVisible: boolean }) {
  const { colors }: Theme = useTheme();

  const inputRef: any = useRef();
  const onFocusHandler = () => {
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 20);
  };

  useEffect(() => {
    onFocusHandler();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        display: isVisible ? 'flex' : 'none',
      }}>
      <StatusBar backgroundColor={'transparent'} />
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          padding: 5,
        }}>
        <MyText
          textStyle={{ fontFamily: 'Poppins-Bold', color: colors.primary }}
          size={32}
          text={'Whoops!!'}
        />
      </View>
      <View style={{ alignItems: 'center', marginVertical: 5 }}>
        <MyText size={16} text={`You're not connected to the Internet.`} />
        <MyText size={16} text={'Please try again when you are online.'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
