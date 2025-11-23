import { View, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { getCurrentUser, getUserByUsername, login } from "../../services/user.service"
import { useState } from "react"
import { BrandText } from "../../components/text/BrandText"
import { TopSquiggle } from "../../components/squiggles/TopSquiggle"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { UserInput } from "../../components/UserInput"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomLink } from "../../components/BottomLink"
import { PasswordInput } from "../../components/PasswordInput"

export const Login = () => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState({username: '', password: ''})

    const navigation = useNavigation()
    const { login: loginUser, user, setLoggedInData } = useLogin()

    const checkUserToken = async () => {
        console.log("user already logged in:", user)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({type: 'success', text1: "Login Successful!"})
            if (data.firstLogin) navigation.replace('TutorialPage1')
            else navigation.replace('Dashboard')
        } catch (error) {
            console.log('Failed to fetch user data', error)
        }
    }

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleLogin = () => {
        const {password} = formData
        const username = formData.username.toLowerCase()
        getUserByUsername(username)
            .then(res => {
                if (res && !res.isActive) {
                    Toast.show({type: 'error', text1: "Account Deleted."})
                }
                else if (res && res.isVerified) {
                    login({username, password})
                        .then(res => {
                            if (res.passwordReset) {
                                navigation.navigate("SetPassword", {username})
                            }
                            else {
                                loginUser(res)
                                    .then(()=> checkUserToken())
                            }
                        })
                        .catch(error => {
                            console.log("login error:", error)
                            setApiErrors(prev => ({...prev, login: "Unable to login."}))
                            Toast.show({type: 'error', text1: "Unable to login."})
                        })
                }
                else if (res){
                    Toast.show({type: 'error', text1: "Account is not verified.", text2: "Verify your account in the home screen."})
                } else Toast.show({type: 'error', text1: "Username not found."})
            })
            .catch(error => {
                console.log("getUserByUsername error:", error)
                setApiErrors(prev => ({...prev, getUserByUsername: "Unable to check username."}))
                Toast.show({type: 'error', text1: "Unable to check username."})
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
                <View>
                    <TopSquiggle />

                    <View className="px-[16px] mt-[75px]">
                        <Pressable
                            className="ps-2"
                            hitSlop={20}
                            onPress={() => navigation.replace("StartingPage", {animationType: "slide_from_left"})}
                        >
                            <BackArrow/>
                        </Pressable>

                        <BrandBoldText className="text-[32px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[37px]">
                            Hi, welcome.
                        </BrandBoldText>
                        
                        <View className="items-center mb-10">
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                                Sign in to your account
                            </BrandText>
                        </View>

                        {apiErrors.login && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.login}
                            </BrandText>
                        )}
                        {apiErrors.getUserByUsername && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.getUserByUsername}
                            </BrandText>
                        )}

                        <View className="mb-6">
                            <UserInput
                                icon={EmailIcon}
                                value={formData.username}
                                onChangeText={(text) => handleChange('username', text)}
                                placeholder="Email"
                            />
                        </View>

                        <View className="mb-8">
                            <PasswordInput
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                placeholder="Password"
                            />
                        </View>

                        <View className="items-end mb-8 pe-2">
                            <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                                <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[14px]">
                                    Forgot your password?
                                </BrandText>
                            </Pressable>
                        </View>

                        <PrimaryButton onPress={handleLogin} label="Sign in" />
                    
                    </View>
                </View>

                <View className="mb-[50px] items-center">
                    <BottomLink onPress={() => navigation.navigate('ParentRegistration')} text="Starting a family? " link="Set up Your Account Here" />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}