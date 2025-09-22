import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { UserInput } from "../../components/UserInput"
import { FirstNameIcon } from "../../components/icons/FirstNameIcon"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { checkUsername, resendCode, updateUser } from "../../services/user.service"
import { useLogin } from "../../context/UserContext"
import Toast from "react-native-toast-message"
import { PrimaryButton } from "../../components/PrimaryButton"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const EditProfile = () => {

    const navigation = useNavigation()
    const {logout, loggedInData, setLoggedInData} = useLogin()
    
    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState({name: loggedInData.name, username: loggedInData.username})
    const [formErrors, setFormErrors] = useState({})
    
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

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
            )
        }
        setFormErrors(prev => ({...prev, [name]: validations[name](value)}))
    }

    const isReadyToSubmit = () => {
        for (let key in formErrors){
            if (formErrors[key] != false || formData[key] == "") {
                return false
            }
        }
        return true
    }

    const handleSubmit = () => {
        if (!isReadyToSubmit()){
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }
        const { name } = formData
        const username = formData.username.toLowerCase()
        if (loggedInData.username != username) {
            checkUsername(username)
                .then((res) => {
                    if (res) {
                        Toast.show({
                            type: 'error',
                            text1: "Username already exists."
                        })
                    } else {
                        updateUser({name, username, isVerified: false})
                            .then( () => { 
                                Toast.show({
                                    type: 'success',
                                    text1: "Profile updated successfully!"
                                })
                                resendCode(username)
                                logout()
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'PasscodeVerification', params: {username, updatingUsername: true}}]
                                })
                            })
                            .catch( error => {
                                console.log("updateUser error:", error)
                                setApiErrors(prev => ({...prev, updateUser: "Unable to edit profile."}))
                                Toast.show({
                                    type: 'error',
                                    text1: "Unable to edit profile."
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
        else if (loggedInData.name != name) {
            updateUser({name})
                .then( (res) => { 
                    Toast.show({
                        type: 'success',
                        text1: "Profile updated successfully!"
                    })
                    setLoggedInData(res)
                    navigation.goBack()
                })
                .catch( error => {
                    console.log("updateUser error:", error)
                    setApiErrors(prev => ({...prev, updateUser: "Unable to edit profile."}))
                    Toast.show({
                        type: 'error',
                        text1: "Unable to edit profile."
                    })
                })
        } else {
            Toast.show({
                type: 'error',
                text1: "No changes have been made."
            })
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg">
                <View className="flex-1 justify-between">
                    <View className="px-[16px]">
                        <View className="flex-row mt-[75px]">
                            <Pressable
                                className="pt-4 ps-2"
                                hitSlop={20}
                                onPress={() => navigation.navigate("Settings", {animationType: "slide_from_left"})}
                            >
                                <BackArrow/>
                            </Pressable>

                            <View className="flex-1 ms-[34px]">
                                <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                                    Edit Profile
                                </BrandBoldText>
                            </View>
                        </View>

                        <View className="items-center">
                            <View
                                className="rounded-full me-3 aspect-square h-[85px] justify-center
                                    dark:bg-[#333740] bg-[#A1A4AA] shadow my-10"
                            >
                                <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[65px] text-center">
                                    {loggedInData.name[0]}
                                </BrandText>
                            </View>
                        </View>

                        {apiErrors.updateUser && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.updateUser}
                            </BrandText>
                        )}
                        {apiErrors.checkUsername && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.checkUsername}
                            </BrandText>
                        )}

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
                        
                        <View className="items-center">
                            <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px] px-2">
                                Email verification is required upon updating your email.
                            </BrandText>
                        </View>
                    </View>

                    <View className="px-[16px] w-full mb-[90px] z-10">
                        <PrimaryButton onPress={handleSubmit} label="Confirm"/>
                    </View>
                </View>
                
                <View className="absolute bottom-0 right-0 z-0">
                    <SmallBottomRightSquiggle />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}