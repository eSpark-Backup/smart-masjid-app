import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Theme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoCircle } from '../../assets';
import MyText from '../MyText';

interface CustomTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  iconColor?: string;
  bgColor?: string;
  iconHeight?: number;
  iconWidth?: number;
}

export default function MyTooltip({
  content,
  iconColor = '#006870',
  bgColor = '#fff',
  position = 'top',
  iconHeight = 22,
  iconWidth = 22,
}: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { colors }: Theme = useTheme();
  return (
    <View>
      <Tooltip
        isVisible={isVisible}
        backgroundColor="transparent"
        contentStyle={{
          backgroundColor: bgColor,
          borderRadius: 10,
          borderColor: colors.primary,
          borderWidth: 0.5,
        }}
        tooltipStyle={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
        }}
        childrenWrapperStyle={{ display: 'none' }}
        arrowStyle={{ borderTopColor: colors.primary }}
        content={<MyText textStyle={{ color: '#3E3E3E' }} text={content} />}
        placement={position}
        backgroundStyle={{ backgroundColor: 'blue' }}
        topAdjustment={Platform.OS == 'android' ? -useSafeAreaInsets().top : 0}
        onClose={() => setIsVisible(false)}>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <InfoCircle
            height={iconHeight}
            width={iconWidth}
            onPress={() => {
              setIsVisible(!isVisible);
            }}
            style={{ color: iconColor }}
          />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
}
