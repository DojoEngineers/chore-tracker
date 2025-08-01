import "./global.css"
import Toast from 'react-native-toast-message'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { UserContextProvider } from './context/UserContext';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { GlobalStyling } from "./components/GlobalStyling";
import { SplashScreen } from "./views/login/SplashScreen";
import { StartingPage } from "./views/login/StartingPage";
import { ParentRegistration } from "./views/login/ParentRegistration";
import { UsernameVerification } from "./views/login/UsernameVerification";
import { PasscodeVerification } from "./views/login/PasscodeVerification";
import { TutorialAssign } from "./views/login/TutorialAssign";
import { TutorialTrack } from "./views/login/TutorialTrack";
import { TutorialResults } from "./views/login/TutorialResults";
import { ForgotPassword } from "./views/login/ForgotPassword";
import { ChangePassword } from "./views/login/ChangePassword";
import { Login } from "./views/login/Login";
import { Home } from "./views/home/Home";

export default function App() {

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  })
  if (!fontsLoaded) return null

  const Stack = createStackNavigator()

  return (
    <UserContextProvider>
      <GlobalStyling>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen}></Stack.Screen>
            <Stack.Screen name="StartingPage" component={StartingPage}></Stack.Screen>
            <Stack.Screen name="ParentRegistration" component={ParentRegistration}></Stack.Screen>
            <Stack.Screen name="PasscodeVerification" component={PasscodeVerification}></Stack.Screen>
            <Stack.Screen name="UsernameVerification" component={UsernameVerification}></Stack.Screen>
            <Stack.Screen name="TutorialAssign" component={TutorialAssign}></Stack.Screen>
            <Stack.Screen name="TutorialTrack" component={TutorialTrack}></Stack.Screen>
            <Stack.Screen name="TutorialResults" component={TutorialResults}></Stack.Screen>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
            <Stack.Screen name="ChangePassword" component={ChangePassword}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalStyling>
      <Toast />
    </UserContextProvider>
  )
  
}