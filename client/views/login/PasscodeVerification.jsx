import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { getCurrentUser, resendCode, verify } from '../../services/user.service'
import Toast from 'react-native-toast-message'
import { useLogin } from "../../context/UserContext"

const CELL_COUNT = 6

export const PasscodeVerification = ({route}) => {

    const [value, setValue] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()
    const { userName } = route.params
    const { login, setLoggedInData } = useLogin()

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    })

    const handleVerify = value => {
        const data = {userName, code: value}
        verify(data)
            .then(async (res) => {
                login(res)
                setLoggedInData(await getCurrentUser())
                Toast.show({
                    type: 'success',
                    text1: "Account verified successfully!"
                })
                navigation.replace('TutorialAssign')
            })
            .catch(error => {
                console.log("verify error:", error)
                setApiErrors(prev => ({...prev, verify: "Unable to verify account."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to verify account."
                })
            })
    }

    const resend = () => {
        resendCode(userName)
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
        <View>
            <Text>One Time Passcode Verification</Text>
            <Text>Enter the verification code that was just sent to {userName}.</Text>
            <View style={{ padding: 20 }}>
                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? '|' : '•')}
                        </Text>
                    )}
                />
            </View>
            <Pressable onPress={() => handleVerify(value)}>
                <Text>Verify</Text>
            </Pressable>

            {apiErrors.verify && (
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    {apiErrors.verify}
                </Text>
            )}
            {apiErrors.resendCode && (
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    {apiErrors.resendCode}
                </Text>
            )}


            <View>
                <Text>Didn't receive a code?</Text>
                <Pressable onPress={resend}>
                    <Text>Resend</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { padding: 20 },
    codeFieldRoot: { marginTop: 20, width: 280, marginLeft: 'auto', marginRight: 'auto' },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        marginHorizontal: 5,
    },
    focusCell: {
        borderColor: '#007AFF',
    },
})