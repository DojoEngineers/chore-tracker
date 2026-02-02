import { useCallback, useState } from "react"
import { View, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native"
import { sendPassword, getUserByUsername } from "../../services/user.service"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { UserInput } from "../../components/UserInput"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BottomSquiggle } from "../../components/squiggles/BottomSquiggle"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { useLogin } from "../../context/UserContext"

export const ForgotPassword = () => {

    const [username, setUsername] = useState("")
    const [ apiErrors, setApiErrors ] = useState({})
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const navigation = useNavigation()
    const {logout} = useLogin()

    useFocusEffect(
        useCallback(() => {
            setIsButtonLoading(false)
        }, [])
    )

    const resetPassword = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        getUserByUsername(username.toLowerCase())
            .then(res => {
                if (res && !res.isVerified){
                    Toast.show({type: 'error', text1: "Account is not verified.", text2: "Verify your account in the home screen."})
                    setIsButtonLoading(false)
                }
                else if (res) {
                    sendPassword(username.toLowerCase())
                        .then(() => {
                            Toast.show({type: 'success', text1: "Email sent!"})
                            logout()
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login', params: { animationType: 'slide_from_left' }}]
                            })
                        })
                        .catch(error => {
                            console.log("sendPassword error: ", error)
                            setApiErrors(prev => ({...prev, sendPassword: "Unable to reset password."}))
                            Toast.show({type: 'error', text1: "Unable to reset password."})
                            setIsButtonLoading(false)
                        })
                } else {
                    Toast.show({type: 'error', text1: "Username not found."})
                    setIsButtonLoading(false)
                }
            })
            .catch(error => {
                console.log("getUserByUsername error:", error)
                setApiErrors(prev => ({...prev, getUserByUsername: "Unable to check username."}))
                Toast.show({type: 'error', text1: "Unable to check username."})
                setIsButtonLoading(false)
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
                <View className="px-[16px]">
    
                    <View className="flex-row items-center mt-[20%] mb-8 ps-2">
                        <Pressable
                            hitSlop={20}
                            onPress={() => navigation.goBack()}
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
                            You will receive an email with a temporary password.
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
                        <PrimaryButton onPress={resetPassword} label="Submit" disabled={isButtonLoading}/>
                    </View>
                </View>

                <View className="items-end">
                    <BottomSquiggle/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}