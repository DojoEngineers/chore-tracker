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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserInput } from "../../components/UserInput"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomLink } from "../../components/BottomLink"

const DEFAULT_FORM_VALUES = {
    name: "",
    username: ""
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
            )
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
        const { name } = formData
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
                    register({name, username, isParent})
                        .then( () => { 
                            Toast.show({
                                type: 'success',
                                text1: "Account created successfully!"
                            })
                            navigation.navigate('PasscodeVerification', {username, isFirstLogin: true})
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

                        <View className="flex-row p-[17px]">
                            <View className="pt-4 ps-2">
                                <Pressable
                                    onPress={() => navigation.goBack()}
                                >
                                    <BackArrow/>
                                </Pressable>
                            </View>

                            <View className="flex-1 mb-6 ms-[34px]">
                                <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                                    Create a parent profile to get started
                                </BrandBoldText>
                            </View>
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

                        <View className="px-[16px]">
                            <View className="mb-6">
                                <UserInput
                                    icon={FirstNameIcon}
                                    value={formData.name}
                                    onChangeText={(text) => handleChange('name', text)}
                                    placeholder="First name"
                                    error={formErrors.name}
                                />
                            </View>

                            <View className="mb-12">
                                <UserInput
                                    icon={EmailIcon}
                                    value={formData.username}
                                    onChangeText={(text) => handleChange('username', text)}
                                    placeholder="Email"
                                    error={formErrors.username}
                                />
                            </View>

                            <PrimaryButton onPress={handleSubmit} label="Register"/>
                        </View>
                    </View>

                    <View className="mb-20 items-center">
                        <View className="mb-2">
                            <BottomLink
                                onPress={() => navigation.navigate('UsernameVerification')}
                                text="Already Registerd? "
                                link="Verify Here"
                            />
                        </View>

                            <BottomLink
                                onPress={() => navigation.navigate('Login')}
                                text="Already have an account? "
                                link="Login Now"
                            />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}