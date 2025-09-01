import { useNavigation } from "@react-navigation/native"
import { View, Pressable } from "react-native"
import { BrandBoldText } from '../../components/text/BrandBoldText'
import { BrandText } from '../../components/text/BrandText'
import { LogoTopSquiggle } from "../../components/squiggles/LogoTopSquiggle"
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle"
import { useLogin } from "../../context/UserContext"
import { getCurrentUser } from "../../services/user.service"
import Toast from "react-native-toast-message"
import { useEffect, useState } from "react"
import Constants from 'expo-constants';
import axios from "axios"

export const StartingPage = () => {

    const navigation = useNavigation()
    const { user, isLoggingOut, isLoggedIn, setLoggedInData } = useLogin()

    const [status, setStatus] = useState("none")

    const checkUserToken = async () => {
        console.log("user already logged in:", user)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({
                type: 'success',
                text1: "Login Successful!"
            })
            if (data.isParent) {
                navigation.replace('ParentDashboard')
            } else {
                navigation.replace('KidDashboard')
            }
        } catch (error) {
            console.log('Failed to fetch user data', error)
        }
    }

    useEffect(() => {
        console.log("login useEffect")
        if (!user || !user._id) {
            console.log("No valid user, staying on login page")
            return;
        }
        const timer = setTimeout(() => {
            checkUserToken()
        }, 200)
        return () => clearTimeout(timer)
    }, [])

        // useEffect(() => {
        //     console.log("Backend URL:", Constants.expoConfig.extra.BACKEND_API_URL);
        //     axios.get(`${Constants.expoConfig.extra.BACKEND_API_URL}/user/all`)
        //         .then(res => setStatus("✅ Server says: " + res.data))
        //         .catch(err => setStatus("❌ Error: " + err.message));
        // }, []);

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

            <LogoTopSquiggle />

            <View className="items-center px-[16px]">
                <BrandBoldText className="text-[40px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                    Chore Tracking App
                </BrandBoldText>
            </View>

            <View className="items-center px-[16px]">
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Backend URL:</Text>
                    <Text>{status}</Text>
                </View>
                <Pressable
                    className="p-[10px] mb-6 rounded-full items-center justify-center bg-[#84A99D] w-full h-[56px]"
                    onPress={() => navigation.navigate('Login')}
                >
                    <BrandBoldText className="text-white text-[20px]">Login</BrandBoldText>
                </Pressable>

                <Pressable
                    className="p-[10px] rounded-full items-center justify-center bg-[#455C56] w-full h-[56px]"
                    onPress={() => navigation.navigate('ParentRegistration')}
                >
                    <BrandBoldText className="text-white text-[20px]">Start a family account</BrandBoldText>
                </Pressable>
            </View>

            <View>
                <View className="flex-row px-[16px] justify-center">
                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">Added by a parent? </BrandText>
                    <Pressable hitSlop={20} onPress={() => navigation.navigate('UsernameVerification')}>
                        <BrandBoldText className="text-lightLink dark:text-darkLink text-xl">Verify Here</BrandBoldText>
                    </Pressable>
                </View>

                <View className="items-end">
                    <LogoBottomSquiggle />
                </View>
            </View>

        </View>
    )
}