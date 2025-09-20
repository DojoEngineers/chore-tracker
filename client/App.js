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
import { TutorialPage1 } from "./views/login/TutorialPage1";
import { TutorialPage2 } from "./views/login/TutorialPage2";
import { TutorialPage3 } from "./views/login/TutorialPage3";
import { ForgotPassword } from "./views/login/ForgotPassword";
import { SetPassword } from "./views/login/SetPassword";
import { Login } from "./views/login/Login";
import { Dashboard } from "./views/parent/Dashboard";
import { Settings } from "./views/settings/Settings";
import { EditProfile } from "./views/settings/EditProfile";
import { ManageFamily } from "./views/settings/ManageFamily";
import { AddFamilyMember } from "./views/settings/AddFamilyMember";
import { NewChore } from "./views/parent/NewChore";
import { NewChoreDetails } from "./views/parent/NewChoreDetails";
import { VerifyPassword } from "./views/settings/VerifyPassword";
import { Help } from "./views/settings/Help";
import { Terms } from "./views/settings/Terms";
import { Privacy } from "./views/settings/Privacy";
import { Kids } from "./views/parent/Kids";
import { KidDetails } from "./views/parent/KidDetails";
import { ViewChore } from "./views/parent/ViewChore";
import { Today } from "./views/parent/Today";
import { Approve } from "./views/parent/Approve";
import { DeleteKid } from "./views/settings/DeleteKid";
import { Completed } from "./views/kid/Completed";
import { ThisWeek } from "./views/kid/ThisWeek";

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
              <Stack.Screen name="TutorialPage1" component={TutorialPage1}></Stack.Screen>
              <Stack.Screen name="TutorialPage2" component={TutorialPage2}></Stack.Screen>
              <Stack.Screen name="TutorialPage3" component={TutorialPage3}></Stack.Screen>
              <Stack.Screen name="Dashboard" component={Dashboard} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="Login" component={Login} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
              <Stack.Screen name="SetPassword" component={SetPassword}></Stack.Screen>
              <Stack.Screen name="Settings" component={Settings} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="EditProfile" component={EditProfile}></Stack.Screen>
              <Stack.Screen name="ManageFamily" component={ManageFamily} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="AddFamilyMember" component={AddFamilyMember}></Stack.Screen>
              <Stack.Screen name="NewChore" component={NewChore} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="NewChoreDetails" component={NewChoreDetails}></Stack.Screen>
              <Stack.Screen name="VerifyPassword" component={VerifyPassword}></Stack.Screen>
              <Stack.Screen name="Help" component={Help}></Stack.Screen>
              <Stack.Screen name="Terms" component={Terms}></Stack.Screen>
              <Stack.Screen name="Privacy" component={Privacy}></Stack.Screen>
              <Stack.Screen name="Kids" component={Kids} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="KidDetails" component={KidDetails} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ViewChore" component={ViewChore}></Stack.Screen>
              <Stack.Screen name="Today" component={Today} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="Approve" component={Approve} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="DeleteKid" component={DeleteKid}></Stack.Screen>
              <Stack.Screen name="Completed" component={Completed} options={chooseAnimation}></Stack.Screen>
              <Stack.Screen name="ThisWeek" component={ThisWeek} options={chooseAnimation}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </GlobalStyling>
        <Toast />
      </UserContextProvider>
    // </NotificationProvider>
  )

}