import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { Icon } from '@rneui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import TradeScreen from './screens/TradeScreen';
import CompareScreen from './screens/CompareScreen';
import ProfileScreen from './screens/ProfileScreen';
import TeamScreen from './screens/TeamScreen';
import SavedTrades from './screens/SavedTrades';
import LoginScreen from './screens/LoginScreen';
import { rootReducer } from './data/Reducer';

LogBox.ignoreLogs(['AsyncStorage']);


const Stack = createNativeStackNavigator();


const store = configureStore({
  reducer: rootReducer, 
});

function LoginTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName='Log' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Log' component={LoginScreen}/> 
    </Stack.Navigator>
  )
}

function CompareTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName='Compare' screenOptions={{ headerShown: false }} >
      <Stack.Screen name='Compare' component={CompareScreen}/> 
    </Stack.Navigator>
  )
}

function TradeTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName='Trade' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Trade' component={TradeScreen}/>
    </Stack.Navigator>
  )
}

function ProfileTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Profile' component={ProfileScreen}/>
      <Stack.Screen name='Team' component={TeamScreen}/> 
      <Stack.Screen name='Trades' component={SavedTrades}/> 
    </Stack.Navigator>
  )
}

function MainTabs() {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator screenOptions={{headerShown: false}}>
          <Tabs.Screen 
            name="Compare Players" 
            component={CompareTabStack}
            options={{
              tabBarIcon: ({focused, color, size}) => {
                return (
                  <Icon name="compare" type="MaterialIcons" color={color} size={size}/>
                );
              }
            }}
          />
          <Tabs.Screen 
            name="Trade Builder" 
            component={TradeTabStack}
            options={{
              tabBarIcon: ({focused, color, size}) => {
                return (
                  <Icon name="swap-horiz" type="MaterialIcons" color={color} size={size}/>
                );
              }
            }}
          />
          <Tabs.Screen 
            name="User Profile" 
            component={ProfileTabStack}
            options={{
              tabBarIcon: ({focused, color, size}) => {
                return (
                  <Icon name="person" type="MaterialIcons" color={color} size={size}/>
                );
              }
            }}/>
    </Tabs.Navigator>
  )
}

function AppContainer() {
  const Stack = createBottomTabNavigator();

  return(
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='Log' component={LoginScreen} options={{tabBarButton: () => null, tabBarStyle: {display: 'none'}}}/> 
          <Stack.Screen name="main" component={MainTabs} options={{tabBarButton: () => null, tabBarStyle: {display: 'none'}}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default AppContainer;