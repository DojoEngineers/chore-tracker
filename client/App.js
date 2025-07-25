import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { UserContextProvider } from './context/UserContext';
import { ChooseAccountType } from "./views/login/ChooseAccountType"
import Toast from 'react-native-toast-message'
import { ParentRegistration } from "./views/login/ParentRegistration";
import { PasscodeVerification } from "./views/login/PasscodeVerification";
import { TutorialAssign } from "./views/login/TutorialAssign";
import { TutorialTrack } from "./views/login/TutorialTrack";
import { TutorialResults } from "./views/login/TutorialResults";
import { Home } from "./views/home/Home";
import { Login } from "./views/login/Login";
import { UsernameVerification } from "./views/login/UsernameVerification";
import { StartingPage } from "./views/login/StartingPage";
import { ForgotPassword } from "./views/login/ForgotPassword";
import { NewPassword } from "./views/login/NewPassword";

export default function App() {

  const Stack = createStackNavigator()

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartingPage">
          <Stack.Screen name="StartingPage" component={StartingPage}></Stack.Screen>
          <Stack.Screen name="ChooseAccountType" component={ChooseAccountType}></Stack.Screen>
          <Stack.Screen name="ParentRegistration" component={ParentRegistration}></Stack.Screen>
          <Stack.Screen name="PasscodeVerification" component={PasscodeVerification}></Stack.Screen>
          <Stack.Screen name="UsernameVerification" component={UsernameVerification}></Stack.Screen>
          <Stack.Screen name="TutorialAssign" component={TutorialAssign}></Stack.Screen>
          <Stack.Screen name="TutorialTrack" component={TutorialTrack}></Stack.Screen>
          <Stack.Screen name="TutorialResults" component={TutorialResults}></Stack.Screen>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
          <Stack.Screen name="NewPassword" component={NewPassword}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </UserContextProvider>
  )
  
}