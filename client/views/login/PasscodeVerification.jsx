import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Pressable, Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { getCurrentUser, resendCode, verify } from '../../services/user.service'
import Toast from 'react-native-toast-message'
import { useLogin } from "../../context/UserContext"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackArrow } from '../../components/icons/BackArrow'
import { BrandBoldText } from '../../components/text/BrandBoldText'
import { BrandText } from '../../components/text/BrandText'
import { BottomSquiggle } from '../../components/squiggles/BottomSquiggle'
import { PrimaryButton } from '../../components/PrimaryButton'
import { BottomLink } from '../../components/BottomLink'

const CELL_COUNT = 6

export const PasscodeVerification = ({route}) => {

    const [value, setValue] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()
    const { username } = route.params
    const { login, user, setLoggedInData } = useLogin()

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    })

    const checkUserToken = async () => {
        console.log("user already logged in:", user)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({
                type: 'success',
                text1: "Login Successful!"
            })
            navigation.replace('TutorialAssign')
        } catch (error) {
            console.log('Failed to fetch user data', error)
        }
    }

    const handleVerify = value => {
        const data = {username, verificationCode: value}
        verify(data)
            .then(res => {
                Toast.show({
                    type: 'success',
                    text1: "Verification Successful!"
                })
                navigation.navigate("ChangePassword", {username: res.username})
            })
            .catch(error => {
                console.log("verify error:", error)
                setApiErrors(prev => ({...prev, verify: "Unable to verify account. Wrong or expired code."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to verify account.",
                    text2: "Wrong or expired code."
                })
            })
    }

    const resend = () => {
        resendCode(username)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: "Verification code resent!"
                })
            })
            .catch(error => {
                console.log("resendCode error:", error)
                setApiErrors(prev => ({...prev, resendCode: "Failed to resend code."}))
                Toast.show({
                    type: 'error',
                    text1: "Failed to resend code."
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
                    <View className="px-[16px]">

                        <View className="flex-row items-center mt-[150px] mb-4 ps-2">
                            <Pressable
                                onPress={() => navigation.goBack()}
                            >
                                <BackArrow/>
                            </Pressable>

                            <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] ml-10">
                                OTP Verification
                            </BrandBoldText>
                        </View>

                        {apiErrors.verify && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.verify}
                            </BrandText>
                        )}
                        {apiErrors.resendCode && (
                            <BrandText className="text-red-500 text-center">
                                {apiErrors.resendCode}
                            </BrandText>
                        )}

                        <View className="items-center mb-8">
                            <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                                Enter the verification code that was sent to {username}.
                            </BrandText>
                        </View>

                        <View className="px-6 mb-12">
                            <CodeField
                                ref={ref}
                                {...props}
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <View key={index} className="w-12 h-12 border-2 border-gray-300 mx-1 flex items-center justify-center bg-white rounded-lg">
                                        <BrandText
                                            onLayout={getCellOnLayoutHandler(index)}
                                            className={`text-[24px] ${isFocused ? 'border-blue-500' : ''}`}
                                        >
                                            {symbol || (isFocused ? '|' : '•')}
                                        </BrandText>
                                    </View>
                                )}
                            />
                        </View>

                        <View>
                            <PrimaryButton onPress={() => handleVerify(value)} label="Verify" />
                        </View>
                    </View>

                    <View className="relative w-full">
                        <View className="absolute bottom-0 right-0 z-0">
                            <BottomSquiggle/>
                        </View>

                        <View className="flex-row mb-20 justify-center">
                            <BottomLink onPress={resend} text="Didn't receive a code? " link="Resend" />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}