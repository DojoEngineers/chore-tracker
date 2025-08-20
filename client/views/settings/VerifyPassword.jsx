import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { useNavigation } from "@react-navigation/native"
import { verifyPassword } from "../../services/user.service"
import Toast from "react-native-toast-message"
import { useState } from "react"
import { useLogin } from "../../context/UserContext"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomSquiggle } from "../../components/squiggles/BottomSquiggle"
import { BottomLink } from "../../components/BottomLink"
import { PasswordInput } from "../../components/PasswordInput"

export const VerifyPassword = ({route}) => {

    const [password, setPassword] = useState()
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()
    const {loggedInData} = useLogin()
    const {deleteAccount = false, changePassword = false} = route.params

    const handleSubmit = () => {
        const username = loggedInData.username
        verifyPassword({username, password})
            .then(res => {
                if (res) {
                    if (deleteAccount) {
                        navigation.navigate("DeleteAccount")
                    }
                    else {
                        navigation.navigate("SetPassword", {username})
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: "Incorrect password."
                    })
                }
            })
            .catch(error => {
                console.log("verifyPassword error:", error)
                setApiErrors(prev => ({...prev, verifyPassword: "Unable to verify password."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to verify password."
                })
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

                <View className="px-[16px]">
    
                    <View className="flex-row ps-2 mt-[150px] mb-10 items-center">
                        <Pressable
                            hitSlop={20}
                            onPress={() => navigation.navigate("Settings", {animationType: "slide_from_left"})}
                        >
                            <BackArrow/>
                        </Pressable>

                        <BrandBoldText className="text-[30px] text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] ps-6">
                            Verify Password
                        </BrandBoldText>
                    </View>

                    <View className="items-center mb-6 px-2">
                        <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                            {deleteAccount
                            ?
                                "Password verification is required before deleting your account."
                            :
                                "To change your password, enter your current password below."
                            }
                        </BrandText>
                    </View>

                    {apiErrors.verifyPassword && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.verifyPassword}
                        </BrandText>
                    )}

                    <View className="mb-6">
                        <PasswordInput
                            value={password}
                            placeholder="Password"
                            onChangeText={setPassword}
                        />
                    </View>

                    <View>
                        <PrimaryButton onPress={handleSubmit} label="Submit" />
                    </View>
                </View>

                <View className="relative w-full">
                    <View className="absolute bottom-0 right-0 z-0">
                        <BottomSquiggle/>
                    </View>

                    <View className="flex-row mb-20 justify-center">
                        <BottomLink onPress={() => navigation.navigate('ForgotPassword')} text="Forgot Password? " link="Reset Now" />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}