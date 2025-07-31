import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import Toast from 'react-native-toast-message'
import { checkUsername, register } from "../../services/user.service"
import { TopSquiggle } from "../../components/squiggles/TopSquiggle"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { FirstNameIcon } from "../../components/icons/FirstNameIcon"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { PasswordIcon } from "../../components/icons/PasswordIcon"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserInput } from "../../components/UserInput"

const DEFAULT_FORM_VALUES = {
    name: "",
    username: "",
    password: "",
    confirmPassword: ""
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const ParentRegistration = () => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()

    // Dynamically set form data
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
            name: value => (
                value.length < 2 ? "Name must be at least 2 characters long."
                : !NO_EMOJI_REGEX.test(value) ? "Name must not contain emojis."
                : false
            ),
            username: value => (
                !EMAIL_REGEX.test(value)
                ? "Username must be a valid email."
                : !NO_EMOJI_REGEX.test(value) ? "Username must not contain emojis."
                : false
            ),
            password: value => {
                if (value.length < 8) return "Password must be at least 8 characters long."
                else if (!NO_EMOJI_REGEX.test(value)) return "Password must not contain emojis."
                else if (value != formData.confirmPassword) return "Passwords must match."
                else {
                    setFormErrors(prev => ({...prev, confirmPassword: false}))
                    return false
                }
            },
            confirmPassword: value => {
                if (value.length < 8) return "Password must be at least 8 characters long."
                else if (!NO_EMOJI_REGEX.test(value)) return "Password must not contain emojis."
                else if (value != formData.password) return "Passwords must match."
                else {
                    setFormErrors(prev => ({...prev, password: false}))
                    return false
                }
            }
        }
        setFormErrors(prev => ({...prev, [name]: validations[name](value)}))
    }

    // Check for errors before submitting form
    const isReadyToSubmit = () => {
        for (let key in formErrors){
            if (formErrors[key] != false || formData[key] == "") {
                return false
            }
        }
        return true
    }

    // Submit form
    const handleSubmit = () => {
        if (!isReadyToSubmit()){
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }
        const { name, password, confirmPassword } = formData
        const isParent = true
        const username = formData.username.toLowerCase()
        checkUsername(username)
            .then((res) => {
                if (res) {
                    Toast.show({
                        type: 'error',
                        text1: "Username already exists."
                    })
                } else {
                    register({name, username, password, confirmPassword, isParent})
                        .then( () => { 
                            Toast.show({
                                type: 'success',
                                text1: "Account created successfully!"
                            })
                            navigation.navigate('PasscodeVerification', {username}) 
                        })
                        .catch( error => {
                            console.log("register error:", error)
                            setApiErrors(prev => ({...prev, register: "Unable to create account."}))
                            Toast.show({
                                type: 'error',
                                text1: "Unable to create account."
                            })
                        })
                }
            })
            .catch(error => {
                console.log("checkUsername error:", error)
                setApiErrors(prev => ({...prev, checkUsername: "Unable to validate username."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to validate username."
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

                        <View className="items-center p-5 mb-4">
                            <BrandBoldText className="text-[36px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                                Create a parent profile to get started
                            </BrandBoldText>
                        </View>

                        {apiErrors.register && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.register}
                            </BrandText>
                        )}
                        {apiErrors.checkUsername && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.checkUsername}
                            </BrandText>
                        )}

                        <View className="mx-8">
                            <View className="mb-6">
                                <UserInput
                                    icon={FirstNameIcon}
                                    value={formData.name}
                                    onChangeText={(text) => handleChange('name', text)}
                                    placeholder="First name"
                                    error={formErrors.name}
                                />
                            </View>

                            <View className="mb-6">
                                <UserInput
                                    icon={EmailIcon}
                                    value={formData.username}
                                    onChangeText={(text) => handleChange('username', text)}
                                    placeholder="Email"
                                    error={formErrors.username}
                                />
                            </View>

                            <View className="mb-6">
                                <UserInput
                                    icon={PasswordIcon}
                                    value={formData.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    placeholder="Password"
                                    error={formErrors.password}
                                    secureTextEntry={true}
                                />
                            </View>

                            <View className="mb-6">
                                <UserInput
                                    icon={PasswordIcon}
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => handleChange('confirmPassword', text)}
                                    placeholder="Confirm password"
                                    error={formErrors.confirmPassword}
                                    secureTextEntry={true}
                                />
                            </View>

                            <View>
                                <Pressable
                                    onPress={handleSubmit}
                                    className="px-4 py-4 rounded-full items-center justify-center bg-lightButton dark:bg-darkButton w-full"
                                >
                                    <BrandBoldText className="text-white text-xl">
                                        Register
                                    </BrandBoldText>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <View className="mx-8 mb-20 mt-10 items-center">
                        <View className="flex-row mb-2">
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">Already registered? </BrandText>
                            <Pressable onPress={() => navigation.navigate('UsernameVerification')}>
                                <BrandBoldText className="text-lightLink dark:text-darkLink text-xl">Verify Here</BrandBoldText>
                            </Pressable>
                        </View>

                        <View className="flex-row">
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">Already have an account? </BrandText>
                            <Pressable onPress={() => navigation.navigate('Login')}>
                                <BrandBoldText className="text-lightLink dark:text-darkLink text-xl">Login Now</BrandBoldText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}