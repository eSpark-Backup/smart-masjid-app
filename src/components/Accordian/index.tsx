import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import MyText from '../MyText';
import { ArrowDown } from '../../assets';
import { useLayoutAnimation } from '../../utils';
import { WINDOW_WIDTH } from '../../constants';

export default function Accordian({
  question = 'Faq question goes here ?',
  answer = 'Description and answers goes here.\nDescription and answers goes here.\nDescription and answers goes here.',
}: {
  question?: string;
  answer?: string;
}) {
  const { colors }: Theme = useTheme();
  const [isShow, setIsShow] = useState(false);
  const rotationValue = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(isShow ? 1 : 0)).current;

  useEffect(() => {
    useLayoutAnimation(250);
  }, [isShow]);

  useEffect(() => {
    Animated.timing(backgroundOpacity, {
      toValue: isShow ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isShow]);

  const rotateView = () => {
    setIsShow(!isShow);
    Animated.timing(rotationValue, {
      toValue: isShow ? 0 : 180,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const rotateStyle = {
    transform: [
      {
        rotate: rotationValue.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  return (
    <View style={{ width: WINDOW_WIDTH - 30, alignSelf: 'center' }}>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: isShow ? '#F1F7F8' : 'transparent',
          borderRadius: isShow ? 12 : 0,
        }}
        onPress={rotateView}
        activeOpacity={0.8}>
        <Animated.View
          style={{
            flexDirection: 'row',
            borderBottomColor: colors.primary,
            borderBottomWidth: !isShow ? 1 : 0,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <MyText
            size={16}
            text={question}
            textStyle={{ width: WINDOW_WIDTH - 80 }}
          />
          <Animated.View style={[rotateStyle]}>
            <ArrowDown height={12} width={12} />
          </Animated.View>
        </Animated.View>

        {isShow && (
          <Animated.View
            style={{
              backgroundColor: '#F1F7F8',
              paddingHorizontal: 15,
              paddingTop: 15,
            }}>
            <MyText size={16} text={answer} />
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
}
