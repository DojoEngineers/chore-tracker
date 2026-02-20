import { View, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getCurrentUser, getUserByUsername, login } from "../../services/user.service"
import { useCallback, useState } from "react"
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
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const navigation = useNavigation()
    const { login: loginUser, setLoggedInData } = useLogin()

    const checkUserToken = async (userData) => {
        console.log("user logging in:", userData)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({type: 'success', text1: "Login Successful!"})
            navigation.reset({
                index: 0,
                routes: [{ name: data.firstLogin ? 'TutorialPage1' : 'Dashboard' }]
            })
        } catch (error) {
            console.log('Failed to fetch user data', error)
            setIsButtonLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIsButtonLoading(false)
        }, [])
    )

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleLogin = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        const {password} = formData
        const username = formData.username.toLowerCase()
        getUserByUsername(username)
            .then(res => {
                if (res && res.isVerified) {
                    login({username, password})
                        .then(res => {
                            if (res.user.passwordReset) {
                                navigation.navigate("SetPassword", {username})
                            }
                            else {
                                loginUser(res).then((userData) => checkUserToken(userData.user))
                            }
                        })
                        .catch(error => {
                            console.log("login error:", error)
                            setApiErrors(prev => ({...prev, login: "Unable to login."}))
                            Toast.show({type: 'error', text1: "Unable to login."})
                            setIsButtonLoading(false)
                        })
                }
                else if (res){
                    Toast.show({type: 'error', text1: "Account is not verified.", text2: "Verify your account in the home screen."})
                    setIsButtonLoading(false)
                } else {
                    Toast.show({type: 'error', text1: "Username not found."})
                    setIsButtonLoading(false)
                }
            })
            .catch(error => {
                console.log("getUserByUsername error:", error)
                setApiErrors(prev => ({...prev, getUserByUsername: "Unable to check username."}))
                Toast.show({type: 'error', text1: `Unable to check username. ${error.message}`})
                setIsButtonLoading(false)
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
                <View>
                    <TopSquiggle />

                    <View className="px-[16px] mt-[13%]">
                        <Pressable
                            className="ps-2"
                            hitSlop={20}
                            onPress={() => navigation.navigate("StartingPage", {animationType: "slide_from_left"})}
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

                        <PrimaryButton onPress={handleLogin} label="Sign in" disabled={isButtonLoading}/>
                    
                    </View>
                </View>

                <View className="mb-[5%] items-center">
                    <BottomLink onPress={() => navigation.navigate('ParentRegistration')} text="Starting a family? " link="Set up Your Account Here" />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}