import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Pressable, View, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { resendCode, verify } from '../../services/user.service'
import Toast from 'react-native-toast-message'
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
    const { username, updatingUsername = false } = route.params

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    })

    const handleVerify = value => {
        const data = {username, verificationCode: value}
        verify(data)
            .then(res => {
                Toast.show({
                    type: 'success',
                    text1: "Verification Successful!"
                })
                if (updatingUsername) {
                    navigation.navigate("Login")
                }
                navigation.navigate("SetPassword", {username: res.username})
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

    const resend = (username) => {
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
            <View className="flex-1 bg-lightBg dark:bg-darkBg items-center justify-between">
                <View className="px-[16px]">

                    <View className="flex-row items-center mt-[150px] mb-4 ps-2">
                        <Pressable
                            hitSlop={20}
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
                            Enter the verification code that was sent to {username}. This code is only valid for 24 hours.
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

                    <View className="flex-row mb-[50px] justify-center">
                        <BottomLink onPress={() => resend(username)} text="Didn't receive a code? " link="Resend" />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}