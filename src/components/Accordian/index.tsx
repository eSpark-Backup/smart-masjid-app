import { Theme, useTheme } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import MyText from '../MyText';
import { ArrowDown, ArrowUp } from '../../assets';
import { useLayoutAnimation } from '../../utils';
import { Card } from '../../containers';
import { WINDOW_WIDTH } from '../../constants';

export default function Accordian({
  question = 'Please choose between the following?',
  answer = 'No  answer for this question type of answer type ',
}: {
  question?: string;
  answer?: string;
}) {
  const { colors }: Theme = useTheme();
  const [isShow, setIsShow] = useState(true);
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    useLayoutAnimation(500);
  }, [isShow]);

  const rotateView = () => {
    setIsShow(!isShow);
    Animated.timing(rotationValue, {
      toValue: isShow ? 0 : 180,
      duration: 300,
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
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: colors.primary,
            borderBottomWidth: !isShow ? 1 : 0,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10
          }}>
          <MyText text={question} textStyle={{ width: WINDOW_WIDTH - 80 }} />
          <Animated.View style={[rotateStyle]}>
            <ArrowDown />
          </Animated.View>
        </View>

        {isShow && (
          <View>
            <MyText text={answer} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
