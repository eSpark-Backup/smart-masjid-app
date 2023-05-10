import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WINDOW_WIDTH } from '../../constants';
import MyText from '../MyText';
import { Theme, useTheme } from '@react-navigation/native';

const TabView = ({
  tab1Title = 'tab 1',
  tab2Title = 'tab 2',
  onChange = (activeTab: string) => {},
}: {
  tab1Title?: string;
  tab2Title?: string;
  onChange?: (activeTab: string) => void;
}) => {
  const [activeTab, setActiveTab] = React.useState('1');
  const { colors }: Theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: WINDOW_WIDTH - 80,
        alignSelf: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setActiveTab('1');
          onChange('1');
        }}>
        <MyText
          text={tab1Title}
          textStyle={{
            color: activeTab == '1' ? colors.primary : '#9E9F9F',
            fontWeight: '700',
          }}
          size={16}
        />
        {activeTab == '1' && (
          <View
            style={{
              height: 5,
              width: 5,
              backgroundColor: colors.primary,
              borderRadius: 10,
              alignSelf: 'center',
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setActiveTab('2');
          onChange('2');
        }}>
        <MyText
          text={tab2Title}
          textStyle={{
            color: activeTab == '2' ? colors.primary : '#9E9F9F',
            fontWeight: '700',
          }}
          size={16}
        />
        {activeTab == '2' && (
          <View
            style={{
              height: 5,
              width: 5,
              backgroundColor: colors.primary,
              borderRadius: 10,
              alignSelf: 'center',
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TabView;
