import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Toast from 'react-native-toast-message'


export const ChildUsernameVerification = () => {

    const [username, setUsername] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const navigation = useNavigation()

    // Check if username exists
    const usernameExists = async (username) => {
        try {
            return await checkUsername(username)
        } catch (error) {
            console.log("checkUsername error:", error)
            setApiErrors(prev => ({...prev, checkUsername: "Unable to validate username."}))
            Toast.show({
                type: 'error',
                text1: "Unable to validate username."
            })
            return false
        }
    }

    const handleSubmit = async () => {
        const exists = await usernameExists(username)
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
            navigation.navigate('PasscodeVerification', {username}) 
        }
    }

    return (
        <View>
            <View>
                {apiErrors.checkUsername && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {apiErrors.checkUsername}
                    </Text>
                )}
                <Text>To create an account, please ask your parent to add you through the Settings tab in their account.</Text>
                <Text>After your account is created, enter the email or phone number used to sign up below.</Text>
                <TextInput
                    placeholder="Please enter your email or phone number."
                    value={username}
                    onChangeText={setUsername}
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