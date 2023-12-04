import React, { useEffect } from 'react';
import { Theme, useNavigation, useTheme } from '@react-navigation/native';
import { StyleSheet, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, Search, Device, Profile } from '../screens';
import {
  DeviceActiveNew,
  DeviceUnactiveNew,
  HomeActiveSvg,
  HomeSvg,
  ProfileActiveSvg,
  ProfileSvg,
  SearchActiveSvg,
  SearchSvg,
} from '../assets';
import { BottomNavigationParamList, RootStackParamList } from '../types';
import { useHookstate } from '@hookstate/core';
import { globalStore } from '../store/GlobalStates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
        return <DeviceActiveNew height={26} width={26} />;
      } else {
        return <DeviceUnactiveNew height={26} width={26} />;
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

type DSetupNavigationProps = NativeStackScreenProps<
  RootStackParamList & BottomNavigationParamList,
  'DSetup'
>;

function HomeBottomTab() {
  const theme: Theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const navigation: any = useNavigation<DSetupNavigationProps['navigation']>();

  const devSetup = useHookstate(globalStore.devSetup);

  useEffect(() => {
    if (devSetup.get()) {
      navigation.navigate('DSetup');
    }
  }, []);

  console.log('devSetup.get()', devSetup.get());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          return (
            <View style={{ top: Platform.OS == 'ios' ? 10 : 0 }}>
              {TabIcon(route.name, focused)}
            </View>
          );
        },
        headerShown: false,
        tabBarActiveTintColor: colors?.primary,
        tabBarInactiveTintColor: '#9E9F9F',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarShowLabel: true,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen
        name="Device"
        component={Device}
        options={{ tabBarLabel: 'Devices' }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
}

const makeStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    tabBar: {
      shadowOffset: {
        width: 0,
        height: 23,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
      borderTopWidth: 0,
      height: 65,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'red',
    },
    tabBarLabelStyle: {
      // color: '#9E9F9F',
      fontSize: 8,
      bottom: Platform.OS == 'android' ? 12 : undefined,
      top: Platform.OS == 'ios' ? 14 : undefined,
      fontFamily: 'Roboto-Regular',
      // backgroundColor: 'red',
    },
    ActiveTabBarLabelStyle: {
      color: colors.primary,
      fontSize: 14,
      bottom: Platform.OS == 'android' ? 18 : 0,
      // fontWeight: 'bold',
      fontFamily: 'Roboto-Bold',
    },
  });
};

export default HomeBottomTab;
