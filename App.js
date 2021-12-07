/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';
import { Provider } from 'react-redux'
import HomeScreen from './src/homeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/redux/store';

import filterScreen from './src/filterScreen';
import { ImageEdit, ShareIcon } from './assets/icons';
import ShareScreen from './src/shareScreen';




const App = () => {

  const Stack = createNativeStackNavigator();


  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="FilterScreen"
            component={filterScreen} />
          <Stack.Screen name="ShareScreen" component={ShareScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};



export default App;
