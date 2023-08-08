import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { InfoCircle } from '../../assets';

import Tooltip from 'react-native-walkthrough-tooltip';
import { Theme, useTheme } from '@react-navigation/native';

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
  useEffect(() => {}, [isVisible]);
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
        arrowStyle={{ borderTopColor: colors.primary }}
        content={<Text style={{ color: '#3E3E3E' }}>{content}</Text>}
        placement={position}
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
