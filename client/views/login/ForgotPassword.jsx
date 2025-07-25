import { useState } from "react"
import { Text, TextInput, View, Pressable } from "react-native"
import { sendPassword, checkUsername } from "../../services/user.service"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"

export const ForgotPassword = () => {

    const [username, setUsername] = useState("")

    const navigation = useNavigation()

    const resetPassword = () => {
        checkUsername(username)
            .then(res => {
                if (res) {
                    sendPassword(username)
                        .then(() => {
                            Toast.show({
                                type: 'success',
                                text1: "Message sent!",
                            })
                            navigation.replace("Login")
                        })
                        .catch(error => {
                            console.log("sendPassword error: ", error)
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
                console.log("checkUsername error:", error)
                Toast.show({
                    type: 'error',
                    text1: "Unable to validate username.",
                })
            })
    }

    return (
        <View>

            <Text>Forgot Password?</Text>

            <Text>
                Don't worry! It happens. Please enter the email address or phone number linked with your account.
                You will receive a message with a temporary password.
            </Text>

            <TextInput
                placeholder="Email or Phone Number"
                value={username}
                onChangeText={setUsername}
            />

            <Pressable onPress={resetPassword}>
                <Text>Submit</Text>
            </Pressable>

        </View>
    )
}