import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Toast from 'react-native-toast-message'
import { checkUsername } from "../../services/user.service"


export const UsernameVerification = ({route}) => {

    const [username, setUsername] = useState('')
    const [ apiErrors, setApiErrors ] = useState({})

    const { isParent } = route.params
    const navigation = useNavigation()

    const handleSubmit = async () => {
        checkUsername(username)
            .then ( user => {
                if (user && user.isVerified === true ) {
                    Toast.show({
                        type: 'success',
                        text1: "Account already verified.",
                        text2: "Please login."
                    })
                    navigation.replace("Login")
                } else if (user) {
                    navigation.navigate('PasscodeVerification', {user})
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
                console.log("checkUsername error:", error)
                setApiErrors("Unable to validate username.")
                Toast.show({
                    type: 'error',
                    text1: "Unable to validate username.",
                })
            })
    }

    return (
        <View>
            <View>
                {apiErrors.checkUsername && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {apiErrors.checkUsername}
                    </Text>
                )}

                {isParent
                    ?
                        <View>
                            <Text>Please enter the email or phone number linked to your parent account to continue.</Text>
                        </View>
                    :
                        <View>
                            <Text>To create an account, please ask your parent to add you through the Settings tab in their account.</Text>
                            <Text>After your account is created, enter the email or phone number used to sign up below.</Text>
                        </View>
                }

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