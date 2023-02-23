import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomeScreen, UserSetupScreen, DeviceSetupScreen } from '../screens';
import { MyLightTheme } from '../theme';
import { RootStackParamList } from '../types';
import HomeBottomTab from './BottomNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer theme={MyLightTheme}>
      <Stack.Navigator
        initialRouteName="HomeBottomTab"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="USetup" component={UserSetupScreen} />
        <Stack.Screen name="DSetup" component={DeviceSetupScreen} />
        <Stack.Screen name="HomeBottomTab" component={HomeBottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
