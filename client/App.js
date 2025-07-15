import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { UserContextProvider } from './context/UserContext';
import { ChooseAccountType } from "./views/login/ChooseAccountType"

export default function App() {

  const Stack = createStackNavigator()

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChooseAccountType">
          <Stack.Screen name="ChooseAccountType" component={ChooseAccountType}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  )
  
}