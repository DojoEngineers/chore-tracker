import "./global.css"
import Toast from 'react-native-toast-message'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { UserContextProvider } from './context/UserContext';
// import { NotificationProvider } from './contexts/UserContext';
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
import { NewChore } from "./views/parent/NewChore";
import { NewChoreDetails } from "./views/parent/NewChoreDetails";
import { DeleteAccount } from "./views/settings/DeleteAccount";
import { VerifyPassword } from "./views/settings/VerifyPassword";
import { Help } from "./views/settings/Help";
import { Terms } from "./views/settings/Terms";
import { Privacy } from "./views/settings/Privacy";
import { Kids } from "./views/parent/Kids";
import { KidDetails } from "./views/parent/KidDetails";
import { ViewChore } from "./views/parent/ViewChore";
import { Today } from "./views/parent/Today";
import { ApproveDashboard } from "./views/parent/ApproveDashboard";
import { RejectComments } from "./views/parent/RejectComments";
import { DeleteKid } from "./views/settings/DeleteKid";

export default function App() {

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  })
  if (!fontsLoaded) return null

  const chooseAnimation = ({ route }) => {
    const animationType = route.params?.animationType || 'slide_from_right';
    return { animation: animationType }
  }

  const Stack = createStackNavigator()

  return (
    // <NotificationProvider>
      <UserContextProvider>
        <GlobalStyling>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" component={SplashScreen}></Stack.Screen>
              <Stack.Screen name="StartingPage" component={StartingPage} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ParentRegistration" component={ParentRegistration}></Stack.Screen>
              <Stack.Screen name="PasscodeVerification" component={PasscodeVerification}></Stack.Screen>
              <Stack.Screen name="UsernameVerification" component={UsernameVerification}></Stack.Screen>
              <Stack.Screen name="TutorialAssign" component={TutorialAssign}></Stack.Screen>
              <Stack.Screen name="TutorialTrack" component={TutorialTrack}></Stack.Screen>
              <Stack.Screen name="TutorialResults" component={TutorialResults}></Stack.Screen>
              <Stack.Screen name="ParentDashboard" component={ParentDashboard} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="Login" component={Login} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
              <Stack.Screen name="SetPassword" component={SetPassword}></Stack.Screen>
              <Stack.Screen name="Settings" component={Settings} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="EditProfile" component={EditProfile}></Stack.Screen>
              <Stack.Screen name="FamilySettings" component={FamilySettings} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="AddFamilyMember" component={AddFamilyMember}></Stack.Screen>
              <Stack.Screen name="NewChore" component={NewChore} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="NewChoreDetails" component={NewChoreDetails}></Stack.Screen>
              <Stack.Screen name="DeleteAccount" component={DeleteAccount}></Stack.Screen>
              <Stack.Screen name="VerifyPassword" component={VerifyPassword}></Stack.Screen>
              <Stack.Screen name="Help" component={Help}></Stack.Screen>
              <Stack.Screen name="Terms" component={Terms}></Stack.Screen>
              <Stack.Screen name="Privacy" component={Privacy}></Stack.Screen>
              <Stack.Screen name="Kids" component={Kids} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="KidDetails" component={KidDetails} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ViewChore" component={ViewChore}></Stack.Screen>
              <Stack.Screen name="Today" component={Today} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ApproveDashboard" component={ApproveDashboard} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="RejectComments" component={RejectComments}></Stack.Screen>
              <Stack.Screen name="DeleteKid" component={DeleteKid}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </GlobalStyling>
        <Toast />
      </UserContextProvider>
    // </NotificationProvider>
  )

}