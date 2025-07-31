import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import Toast from 'react-native-toast-message'
import { getUserByUsername } from "../../services/user.service"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { BrandText } from "../../components/text/BrandText"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { UserInput } from "../../components/UserInput"
import { BottomSquiggle } from "../../components/squiggles/BottomSquiggle"


export const UsernameVerification = () => {

    const [username, setUsername] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()

    const handleSubmit = async () => {
        getUserByUsername(username)
            .then ( res => {
                if (res && !res.isActive) {
                    Toast.show({
                        type: 'error',
                        text1: "Account Deleted."
                    })
                }
                else if (res && res.isVerified) {
                    Toast.show({
                        type: 'success',
                        text1: "Account already verified.",
                        text2: "Please login."
                    })
                    navigation.replace("Login")
                } else if (res) {
                    navigation.navigate('PasscodeVerification', {username})
                } else {
                    Toast.show({
                        type: 'error',
                        text1: "Username not found.",
                        text2: "Please register before verifying your account."
                    })
                }
            })
            .catch ( error => {
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
                <View className="flex-1 bg-lightBg dark:bg-darkBg items-center justify-between">
                    <View>

                        <View className="flex-row justify-center mt-[150px] mb-4">
                            <Pressable
                                onPress={() => navigation.goBack()}
                            >
                                <BackArrow/>
                            </Pressable>
                            <BrandBoldText className="text-5xl text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px] ml-10">
                                Verify Account
                            </BrandBoldText>
                        </View>

                        <View className="items-center px-10 mb-6">
                            <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-lg">
                                Please enter the email linked to your account to continue.
                            </BrandText>
                        </View>

                        {apiErrors.getUserByUsername && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.getUserByUsername}
                            </BrandText>
                        )}

                        <View className="mb-6 px-10">
                            <UserInput
                                icon={EmailIcon}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Email"
                            />
                        </View>

                        <View className="px-10">
                            <Pressable
                                onPress={handleSubmit}
                                className="px-4 py-4 rounded-full items-center justify-center bg-lightButton dark:bg-darkButton w-full"
                            >
                                <BrandBoldText className="text-white text-xl">
                                    Submit
                                </BrandBoldText>
                            </Pressable>
                        </View>
                    </View>

                    <View className="relative w-full">
                        <View className="absolute bottom-0 right-0 z-0">
                            <BottomSquiggle/>
                        </View>

                        <View className="flex-row mb-20 justify-center">
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