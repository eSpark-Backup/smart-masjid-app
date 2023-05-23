import React from 'react';
import { Theme, useTheme } from '@react-navigation/native';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, Search, Device, Profile } from '../screens';
import {
  DeviceActiveSvg,
  DeviceTabSvg,
  HomeActiveSvg,
  HomeSvg,
  ProfileActiveSvg,
  ProfileSvg,
  SearchActiveSvg,
  SearchSvg,
} from '../assets';
import { BottomNavigationParamList } from '../types';

const Tab = createBottomTabNavigator<BottomNavigationParamList>();

const TabIcon = (screen: string, isFocused: boolean) => {
  switch (screen) {
    case 'Home':
      if (isFocused) {
        return <HomeActiveSvg height={26} width={26} />;
      } else {
        return <HomeSvg height={26} width={26} />;
      }
    case 'Search':
      if (isFocused) {
        return <SearchActiveSvg height={26} width={26} />;
      } else {
        return <SearchSvg height={26} width={26} />;
      }
    case 'Device':
      if (isFocused) {
        return <DeviceActiveSvg height={26} width={26} />;
      } else {
        return <DeviceTabSvg height={26} width={26} />;
      }
    case 'Profile':
      if (isFocused) {
        return <ProfileActiveSvg />;
      } else {
        return <ProfileSvg />;
      }
    default:
      break;
  }
};

function HomeBottomTab() {
  const theme: Theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          return TabIcon(route.name, focused);
        },
        headerShown: false,
        tabBarActiveTintColor: colors?.primary,
        tabBarInactiveTintColor: '#9E9F9F',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Device" component={Device} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const makeStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    tabBar: {
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
      borderTopWidth: 0,
      height: 65,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBarLabelStyle: {
      color: '#9E9F9F',
      fontSize: 14,
      bottom: Platform.OS == 'android' ? 18 : 0,
    },
    ActiveTabBarLabelStyle: {
      color: colors.primary,
      fontSize: 14,
      bottom: Platform.OS == 'android' ? 18 : 0,
      fontWeight: 'bold',
    },
  });
};

export default HomeBottomTab;
