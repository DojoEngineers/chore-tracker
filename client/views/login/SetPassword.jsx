import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import Toast from "react-native-toast-message"
import { changePassword, getCurrentUser } from "../../services/user.service"
import { useLogin } from "../../context/UserContext"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { BottomSquiggle } from "../../components/squiggles/BottomSquiggle"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BackArrow } from "../../components/icons/BackArrow"
import { PasswordInput } from "../../components/PasswordInput"

const DEFAULT_FORM_VALUES = {
    password: "",
    confirmPassword: ""
}

const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const SetPassword = ({route}) => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const navigation = useNavigation()
    const { username } = route.params
    const { login, setLoggedInData, setFamilyData } = useLogin()

    useFocusEffect(
        useCallback(() => {
            setIsButtonLoading(false)
        }, [])
    )

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
    const checkUserToken = async (userData) => {
        console.log("user logging in:", userData)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            setFamilyData(data.family)
            Toast.show({type: 'success', text1: "New password set!"})
            navigation.reset({
                index: 0,
                routes: [{ name: data.firstLogin ? 'TutorialPage1' : 'Dashboard' }]
            })
        } catch (error) {
            console.log('Failed to fetch user data', error)
            setIsButtonLoading(false)
        }
    }

    // Submit form
    const handleSubmit = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        if (!isReadyToSubmit()){
            Toast.show({type: 'error', text1: "Please make corrections to the form."})
            setIsButtonLoading(false)
            return
        }
        
        const {password, confirmPassword} = formData
        const data = {username, password, confirmPassword}
        changePassword(data)
            .then(res => {
                login(res).then((userData)=> checkUserToken(userData.user))
            })
            .catch(error => {
                console.log("changePassword error:", error)
                setApiErrors(prev => ({...prev, changePassword: "Unable to change password."}))
                Toast.show({type: 'error', text1: "Unable to change password."})
                setIsButtonLoading(false)
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
                <View className="px-[16px]">
                    <View className="flex-row ps-2 mt-[20%] mb-10 items-center">
                        <Pressable
                            hitSlop={20}
                            onPress={() => navigation.goBack()}
                        >
                            <BackArrow/>
                        </Pressable>
                        
                        <BrandBoldText className="text-[30px] text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] ps-6">
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
                        <PasswordInput
                            value={formData.password}
                            onChangeText={(text) => handleChange('password', text)}
                            placeholder="New password"
                            error={formErrors.password}
                        />
                    </View>

                    <View className="mb-[50px]">
                        <PasswordInput
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleChange('confirmPassword', text)}
                            placeholder="Confirm password"
                            error={formErrors.confirmPassword}
                        />
                    </View>

                    <View>
                        <PrimaryButton onPress={handleSubmit} label="Submit" disabled={isButtonLoading}/>
                    </View>
                </View>

                <View className="items-end">
                    <BottomSquiggle/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}