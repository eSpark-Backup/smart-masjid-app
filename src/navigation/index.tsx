import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomeScreen, EmailScreen, PhoneScreen } from '../screens';
import { MyLightTheme } from '../theme';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer theme={MyLightTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="Phone" component={PhoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
