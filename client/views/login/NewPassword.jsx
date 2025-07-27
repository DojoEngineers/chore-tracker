import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Toast from "react-native-toast-message"
import { changePassword, getCurrentUser } from "../../services/user.service"
import { useLogin } from "../../context/UserContext"

const DEFAULT_FORM_VALUES = {
    password: "",
    confirmPassword: ""
}

const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const NewPassword = ({route}) => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()
    const { username } = route.params
    const { login, user, setLoggedInData } = useLogin()

    // Dynamically set form data
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
            password: value => {
                if (value.length < 8) return "Password must be at least 8 characters long."
                else if (!NO_EMOJI_REGEX.test(value)) return "Password must not contain emojis."
                else if (value != formData.confirmPassword) return "Passwords must match."
                else {
                    setFormErrors(prev => ({...prev, confirmPassword: false}))
                    return false
                }
            },
            confirmPassword: value => {
                if (value.length < 8) return "Password must be at least 8 characters long."
                else if (!NO_EMOJI_REGEX.test(value)) return "Password must not contain emojis."
                else if (value != formData.password) return "Passwords must match."
                else {
                    setFormErrors(prev => ({...prev, password: false}))
                    return false
                }
            }
        }
        setFormErrors(prev => ({...prev, [name]: validations[name](value)}))
    }

    // Check for errors before submitting form
    const isReadyToSubmit = () => {
        for (let key in formErrors){
            if (formErrors[key] != false || formData[key] == "") {
                return false
            }
        }
        return true
    }

    // Set logged in data with token
    const checkUserToken = async () => {
        console.log("user already logged in:", user)
        try {
            const data = await getCurrentUser()
            setLoggedInData(data)
            Toast.show({
                type: 'success',
                text1: "Login Successful!"
            })
            navigation.replace('Home')
        } catch (error) {
            console.log('Failed to fetch user data', error)
        }
    }

    // Submit form
    const handleSubmit = () => {
        if (!isReadyToSubmit()){
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
        }
        const data = {username, password: formData.password}
        changePassword(data)
            .then(res => {
                return login(res)
            })
            .then(savedToken => {
                if (savedToken) {
                    checkUserToken()
                }
            })
            .catch(error => {
                console.log("changePassword error:", error)
                setApiErrors(prev => ({...prev, changePassword: "Unable to change password."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to change password."
                })
            })
    }

    return (
        <View>
            <Text>Create New Password</Text>

            <View>
                {formErrors.password && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {formErrors.password}
                    </Text>
                )}
                <Text>Password:</Text>
                <TextInput
                    placeholder="New password"
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    secureTextEntry={true}
                />
            </View>

            <View>
                {formErrors.confirmPassword && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {formErrors.confirmPassword}
                    </Text>
                )}
                <Text>Confirm Password:</Text>
                <TextInput
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    secureTextEntry={true}
                />
            </View>

            {apiErrors.changePassword && (
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    {apiErrors.changePassword}
                </Text>
            )}

            <Pressable onPress={handleSubmit}>
                <Text>Submit</Text>
            </Pressable>

        </View>
    )
}