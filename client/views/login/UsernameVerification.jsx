import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Toast from 'react-native-toast-message'
import { getUserByUsername } from "../../services/user.service"


export const UsernameVerification = ({route}) => {

    const [username, setUsername] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const { isParent } = route.params
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
                if (res && res.isVerified) {
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
                    navigation.replace("ChooseAccountType")
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
        <View>
            <View>
                {apiErrors.getUserByUsername && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {apiErrors.getUserByUsername}
                    </Text>
                )}

                {isParent
                    ?
                        <View>
                            <Text>Please enter the email linked to your parent account to continue.</Text>
                        </View>
                    :
                        <View>
                            <Text>To create an account, please ask your parent to add you through the Settings tab in their account.</Text>
                            <Text>After your account is created, enter the email used to sign up below.</Text>
                        </View>
                }

                <TextInput
                    placeholder="Email"
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