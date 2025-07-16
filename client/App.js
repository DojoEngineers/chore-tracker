import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { UserContextProvider } from './context/UserContext';
import { ChooseAccountType } from "./views/login/ChooseAccountType"
import Toast from 'react-native-toast-message'
import { ParentRegistration } from "./views/login/ParentRegistration";
import { Tutorial } from "./views/login/Tutorial";

export default function App() {

  const Stack = createStackNavigator()

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChooseAccountType">
          <Stack.Screen name="ChooseAccountType" component={ChooseAccountType}></Stack.Screen>
          <Stack.Screen name="ParentRegistration" component={ParentRegistration}></Stack.Screen>
          <Stack.Screen name="Tutorial" component={Tutorial}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </UserContextProvider>
  )
  
}