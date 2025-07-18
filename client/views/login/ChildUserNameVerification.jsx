import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Toast from 'react-native-toast-message'


export const ChildUserNameVerification = () => {

    const [userName, setUserName] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()

    // Check if userName exists
    const userNameExists = async (userName) => {
        try {
            return await checkUserName(userName)
        } catch (error) {
            console.log("checkUserName error:", error)
            setApiErrors(prev => ({...prev, checkUserName: "Unable to validate username."}))
            Toast.show({
                type: 'error',
                text1: "Unable to validate username."
            })
            return false
        }
    }

    const handleSubmit = async () => {
        const exists = await userNameExists(userName)
        if (!exists) {
            return Toast.show({
                type: 'error',
                text1: "Username does not exist",
                text2: "or could not be validated."
            })
        }
        else {
            Toast.show({
                type: 'success',
                text1: "Username validated successfully!"
            })
            navigation.navigate('PasscodeVerification', {userName}) 
        }
    }

    return (
        <View>
            <View>
                {apiErrors.checkUserName && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {apiErrors.checkUserName}
                    </Text>
                )}
                <Text>To create an account, please ask your parent to add you through the Settings tab in their account.</Text>
                <Text>After your account is created, enter the email or phone number used to sign up below.</Text>
                <TextInput
                    placeholder="Please enter your email or phone number."
                    value={userName}
                    onChangeText={setUserName}
                />
                <Pressable onPress={handleSubmit}> 
                    <Text>Submit</Text>
                </Pressable>
            </View>

            <View>
                <Text>Already have an account?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}> 
                    <Text>Login Now</Text>
                </Pressable>
            </View>
        </View>
    )
}