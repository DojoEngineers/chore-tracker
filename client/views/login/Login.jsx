import { Text, TextInput, View, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { getCurrentUser, getUserByUsername, login } from "../../services/user.service"
import { useEffect, useState } from "react"
import { BrandText } from "../../components/text/BrandText"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { TopSquiggle } from "../../components/squiggles/TopSquiggle"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { UserInput } from "../../components/UserInput"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { PasswordIcon } from "../../components/icons/PasswordIcon"

export const Login = () => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState({
        username: '',
        password: ''
        })

    const navigation = useNavigation()
    const { login: loginUser, user, isLoggingOut, isLoggedIn, setLoggedInData } = useLogin()

    const checkUserToken = async () => {
        console.log("user already logged in:", user)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({
                type: 'success',
                text1: "Login Successful!"
            })
            navigation.replace('Home')
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
    }, [user, isLoggingOut, isLoggedIn])

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleLogin = () => {
        getUserByUsername(formData.username)
            .then(res => {
                if (res && !res.isActive) {
                    Toast.show({
                        type: 'error',
                        text1: "Account Deleted."
                    })
                }
                else if (res && res.isVerified && res.passwordReset) {
                    navigation.replace("NewPassword", {username: formData.username})
                }
                else if (res && res.isVerified) {
                    login(formData)
                        .then(res => {
                            return loginUser(res)
                        })
                        .then(savedToken => {
                            if (savedToken) {
                                checkUserToken()
                            }
                        })
                        .catch(error => {
                            console.log("login error:", error)
                            setApiErrors(prev => ({...prev, login: "Unable to login."}))
                            Toast.show({
                                type: 'error',
                                text1: "Unable to login."
                            })
                        })
                }
                else if (res){
                    Toast.show({
                        type: 'error',
                        text1: "Account is not verified.",
                        text2: "Verify your account in the home screen."
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: "Username not found."
                    })
                }
            })
            .catch(error => {
                console.log("getUserByUsername error:", error)
                    setApiErrors(prev => ({...prev, getUserByUsername: "Unable to validate username."}))
                    Toast.show({
                        type: 'error',
                        text1: "Unable to validate username.",
                    })
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
            >
                <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

                    <View>
                        <View>
                            <TopSquiggle />
                        </View>

                        <View className="items-start ps-10">
                            <Pressable
                                onPress={() => navigation.goBack()}
                            >
                                <BackArrow/>
                            </Pressable>
                        </View>

                        <View className="items-center mt-6">
                            <BrandBoldText className="text-5xl text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                                Hi, welcome.
                            </BrandBoldText>
                        </View>

                        <View className="items-center px-10 mb-6">
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-2xl">
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

                        <View className="mb-6 px-10">
                            <UserInput
                                icon={EmailIcon}
                                value={formData.username}
                                onChangeText={(text) => handleChange('username', text)}
                                placeholder="Email"
                            />
                        </View>

                        <View className="mb-6 px-10">
                            <UserInput
                                icon={PasswordIcon}
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                placeholder="Password"
                                secureTextEntry={true}
                            />
                        </View>

                        <View className="items-end px-12 mb-6">
                            <Pressable onPress={() => navigation.navigate('ForgotPassword')}> 
                                <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-xl">
                                    Forgot your password?
                                </BrandText>
                            </Pressable>
                        </View>

                        <View className="px-10">
                            <Pressable
                                onPress={handleLogin}
                                className="px-4 py-4 rounded-full items-center justify-center bg-lightButton dark:bg-darkButton w-full"
                            >
                                <BrandBoldText className="text-white text-xl">
                                    Login
                                </BrandBoldText>
                            </Pressable>
                        </View>
                    </View>

                    <View className="flex-row mb-20 justify-center">
                        <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-lg">Starting a family? </BrandText>
                        <Pressable onPress={() => navigation.navigate('ParentRegistration')}>
                            <BrandBoldText className="text-lightLink dark:text-darkLink text-lg">Set up your account here</BrandBoldText>
                        </Pressable>
                    </View>

                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}