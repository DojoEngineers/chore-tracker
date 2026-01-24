import { useNavigation } from "@react-navigation/native"
import { View, Pressable } from "react-native"
import { BrandBoldText } from '../../components/text/BrandBoldText'
import { BrandText } from '../../components/text/BrandText'
import { LogoTopSquiggle } from "../../components/squiggles/LogoTopSquiggle"
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle"
import { useLogin } from "../../context/UserContext"
import { getCurrentUser } from "../../services/user.service"
import Toast from "react-native-toast-message"
import { useEffect, useRef } from "react"

export const StartingPage = () => {

    const navigation = useNavigation()
    const { user, setLoggedInData } = useLogin()

    const checkUserToken = async () => {
        console.log("user already logged in:", user)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({type: 'success', text1: "Login Successful!"})
            navigation.reset({
                index: 0,
                routes: [{ name: data.firstLogin ? 'TutorialPage1' : 'Dashboard' }]
            })
        } catch (error) {
            if (error.response?.status !== 401) {
                console.log('Failed to fetch user data', error)
            }
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user || !user.user || !user.user._id) {
                console.log("No valid user, staying on login page")
                return
            }
            checkUserToken()
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
            <LogoTopSquiggle />

            <View className="items-center px-[16px]">
                <BrandBoldText className="text-[40px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                    Track My Chores
                </BrandBoldText>
            </View>

            <View className="items-center px-[16px]">
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
                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">
                        Added by a parent?
                    </BrandText>

                    <Pressable hitSlop={20} onPress={() => navigation.navigate('UsernameVerification')}>
                        <BrandBoldText className="text-lightLink dark:text-darkLink text-xl">
                            {" "}Verify Here
                        </BrandBoldText>
                    </Pressable>
                </View>

                <View className="items-end">
                    <LogoBottomSquiggle />
                </View>
            </View>

        </View>
    )
}