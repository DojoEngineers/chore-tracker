import { useState } from "react"
import { View, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native"
import { sendPassword, getUserByUsername } from "../../services/user.service"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { UserInput } from "../../components/UserInput"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BottomSquiggle } from "../../components/squiggles/BottomSquiggle"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"

export const ForgotPassword = () => {

    const [username, setUsername] = useState("")
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()

    const resetPassword = () => {
        getUserByUsername(username)
            .then(res => {
                if (res && !res.isActive) {
                    Toast.show({
                        type: 'error',
                        text1: "Account Deleted."
                    })
                }
                else if (res && !res.isVerified){
                    Toast.show({
                        type: 'error',
                        text1: "Account is not verified.",
                        text2: "Verify your account in the home screen."
                    })
                }
                else if (res) {
                    sendPassword(username)
                        .then(() => {
                            Toast.show({
                                type: 'success',
                                text1: "Email sent!",
                            })
                            navigation.replace("Login")
                        })
                        .catch(error => {
                            console.log("sendPassword error: ", error)
                            setApiErrors(prev => ({...prev, sendPassword: "Unable to reset password."}))
                            Toast.show({
                                type: 'error',
                                text1: "Unable to reset password.",
                            })
                        })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: "Username not found.",
                    })
                }
            })
            .catch(error => {
                console.log("getUserByUsername error:", error)
                setApiErrors(prev => ({...prev, getUserByUsername: "Unable to check username."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to check username.",
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
        
                        <View className="flex-row items-center mt-[150px] mb-8 ps-2">
                            <Pressable
                                onPress={() => navigation.navigate("Login")}
                            >
                                <BackArrow/>
                            </Pressable>

                            <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] ml-10">
                                Forgot Password?
                            </BrandBoldText>
                        </View>

                        <View className="items-center mb-8 px-[4px]">
                            <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                                Don't worry! It happens. Please enter the email address linked to your account.
                                You will receive a message with a temporary password.
                            </BrandText>
                        </View>

                        {apiErrors.getUserByUsername && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.getUserByUsername}
                            </BrandText>
                        )}
                        {apiErrors.sendPassword && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.sendPassword}
                            </BrandText>
                        )}

                        <View className="mb-10">
                            <UserInput
                                icon={EmailIcon}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Email"
                            />
                        </View>
                
                        <View>
                            <PrimaryButton onPress={resetPassword} label="Submit" />
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