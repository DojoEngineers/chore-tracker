import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { GlobalStyling } from "./components/GlobalStyling";
import { SplashScreen } from "./views/login/SplashScreen";
import { StartingPage } from "./views/login/StartingPage";
// import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

export default function App() {

    // const [fontsLoaded] = useFonts({
    //     Nunito_400Regular,
    //     Nunito_700Bold,
    // })
    // if (!fontsLoaded) return <View><Text>No fonts!</Text></View>

    const Stack = createStackNavigator()

    return (
        // <UserContextProvider>  // Comment out
        <GlobalStyling>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="SplashScreen" component={SplashScreen}></Stack.Screen>
                    <Stack.Screen name="StartingPage" component={StartingPage}></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </GlobalStyling>
        // </UserContextProvider>  // Comment out
    )
}