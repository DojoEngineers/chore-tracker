import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import Toast from "react-native-toast-message"
import { changePassword, getCurrentUser } from "../../services/user.service"
import { useLogin } from "../../context/UserContext"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { UserInput } from "../../components/UserInput"
import { BottomSquiggle } from "../../components/squiggles/BottomSquiggle"
import { PasswordIcon } from "../../components/icons/PasswordIcon"
import { PrimaryButton } from "../../components/PrimaryButton"

const DEFAULT_FORM_VALUES = {
    password: "",
    confirmPassword: ""
}

const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const ChangePassword = ({route}) => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()
    const { username } = route.params
    const { login, user, setLoggedInData } = useLogin()

    // Dynamically set form data
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
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

    // Set logged in data with token
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

    // Submit form
    const handleSubmit = () => {
        if (!isReadyToSubmit()){
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }
        const data = {username, password: formData.password}
        changePassword(data)
            .then(res => {
                return login(res)
            })
            .then(savedToken => {
                if (savedToken) {
                    checkUserToken()
                }
            })
            .catch(error => {
                console.log("changePassword error:", error)
                setApiErrors(prev => ({...prev, changePassword: "Unable to change password."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to change password."
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

                    <View className="px-[16px]">
        
                        <View className="flex-row justify-center mt-[150px] mb-10">
                            <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px]">
                                Create New Password
                            </BrandBoldText>
                        </View>

                        <View className="items-center mb-6 px-2">
                            <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                                Create a strong password with at least 8 characters.
                            </BrandText>
                        </View>

                        {apiErrors.changePassword && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.changePassword}
                            </BrandText>
                        )}

                        <View className="mb-6">
                            <UserInput
                                icon={PasswordIcon}
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                placeholder="New password"
                                error={formErrors.password}
                                secureTextEntry={true}
                            />
                        </View>

                        <View className="mb-[50px]">
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
                            <PrimaryButton onPress={handleSubmit} label="Submit" />
                        </View>
                    </View>

                    <View className="items-end">
                        <BottomSquiggle/>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}