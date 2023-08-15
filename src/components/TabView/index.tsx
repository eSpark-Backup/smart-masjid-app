import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WINDOW_WIDTH } from '../../constants';
import MyText from '../MyText';
import { Theme, useTheme } from '@react-navigation/native';
import MyTitle from '../MyTitle';

const TabView = ({
  tab1Title = 'tab 1',
  tab2Title = 'tab 2',
  currTab = '1',
  onChange = (activeTab: string) => {},
}: {
  tab1Title?: string;
  tab2Title?: string;
  currTab?: string;
  onChange?: (activeTab: string) => void;
}) => {
  const [activeTab, setActiveTab] = React.useState(currTab);
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
        <MyTitle
          text={tab1Title}
          style={{
            color: activeTab == '1' ? colors.primary : '#9E9F9F',
            fontSize: 16,
          }}
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
        <MyTitle
          text={tab2Title}
          style={{
            color: activeTab == '2' ? colors.primary : '#9E9F9F',
            fontSize: 16,
          }}
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
