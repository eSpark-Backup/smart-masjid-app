import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import MyText from '../MyText';
import { Theme, useTheme } from '@react-navigation/native';

export default function NoInternetModal(isVisible: boolean) {
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

  return (
    <>
      <StatusBar backgroundColor={'#000000'} />

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          padding: 5,
        }}>
        {/* <TouchableOpacity onPress={closeModal}>
            <FA name="close" size={moderateVerticalScale(25)} />
          </TouchableOpacity> */}
        <MyText
          textStyle={{ fontFamily: 'Poppins-Bold', color: colors.primary }}
          size={26}
          text={'Whoops!!'}
        />
        {/* <TouchableOpacity onPress={closeModal}>
            <FA name="refresh" size={moderateVerticalScale(25)} />
          </TouchableOpacity> */}
      </View>
      <View style={{ alignItems: 'center', marginVertical: 5 }}>
        <MyText text={'Slow or no internet connection'} />
        <MyText text={'Please check your internet connection'} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
