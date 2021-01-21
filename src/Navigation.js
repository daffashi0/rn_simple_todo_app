import React from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Kategori from './KategoriScreen';
import Todo from './TodoScreen';

const _RootNavigator = createStackNavigator(
  {
    Kategori: Kategori,
    Todo: {
      screen: Todo,
      navigationOptions: {
        headerRight: () => <View style={{flex: 0.1}} />,
        title: 'To Do List',
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerTitleStyle: {
        alignSelf: 'center',
      },
      headerStyle: {
        backgroundColor: '#b39ddb',
      },
    },
  },
);

export default createAppContainer(_RootNavigator);
