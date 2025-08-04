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
import { SetPassword } from "./views/login/SetPassword";
import { Login } from "./views/login/Login";
import { ParentDashboard } from "./views/parent/ParentDashboard";
import { Settings } from "./views/settings/Settings";
import { EditProfile } from "./views/settings/EditProfile";
import { FamilySettings } from "./views/settings/FamilySettings";
import { AddFamilyMember } from "./views/settings/AddFamilyMember";

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
            <Stack.Screen name="ParentDashboard" component={ParentDashboard}></Stack.Screen>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
            <Stack.Screen name="SetPassword" component={SetPassword}></Stack.Screen>
            <Stack.Screen name="Settings" component={Settings}></Stack.Screen>
            <Stack.Screen name="EditProfile" component={EditProfile}></Stack.Screen>
            <Stack.Screen name="FamilySettings" component={FamilySettings}></Stack.Screen>
            <Stack.Screen name="AddFamilyMember" component={AddFamilyMember}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalStyling>
      <Toast />
    </UserContextProvider>
  )
  
}