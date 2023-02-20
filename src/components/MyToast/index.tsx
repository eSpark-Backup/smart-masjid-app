import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { CheckSvg, CrossSvg } from '../../assets';
import { Rounded } from '../Buttons';
import MyText from '../MyText';
import TextLabel from '../TextLabel';

export default function MyToast({
  title,
  message,
  isSuccess = true,
  btnText,
  onPress,
}: {
  title: string;
  message: string;
  isSuccess: boolean;
  btnText: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.container}>
      {title && <TextLabel label={title!!} textStyle={{ fontSize: 24 }} />}
      <View style={{ alignSelf: 'center', marginTop: 20, marginBottom: 40 }}>
        {isSuccess ? <CheckSvg /> : <CrossSvg />}
        <View
          style={{
            width: 10,
            height: 2,
            backgroundColor: '#ffffff',
            position: 'absolute',
            bottom: 0,
            left: 10,
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
        <MyText
          text={message}
          textStyle={{ fontWeight: '400', fontSize: 16, textAlign: 'center' }}
        />
      </View>
      <Rounded onPress={onPress} label={btnText!!} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loader: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
});
