import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import Toast from 'react-native-toast-message'

const DEFAULT_FORM_VALUES = {
    name: "",
    userName: "",
    password: "",
    confirmPassword: ""
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const ParentRegistration = () => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()

    // Dynamically set form data
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
            name: value => (
                value.length < 2 ? "Name must be at least 2 characters long."
                : !NO_EMOJI_REGEX.test(value) ? "Name must not contain emojis."
                : false
            ),
            userName: value => (
                !EMAIL_REGEX.test(value) && value.replace(/\D/g, "").length !== 10
                ? "Username must be a valid email or 10 digit phone number."
                : !NO_EMOJI_REGEX.test(value) ? "Username must not contain emojis."
                : false
            ),
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

    // Check if userName already exists
    const userNameExists = async (userName) => {
        try {
            return await checkUserName(userName)
        } catch (error) {
            console.log("checkUserName error:", error)
            setApiErrors(prev => ({...prev, checkUserName: "Unable to validate user name."}))
            Toast.show({
                type: 'error',
                text1: "Unable to validate user name."
            })
            return true
        }
    }

    // Submit form
    const handleSubmit = async () => {
        if (!isReadyToSubmit()){
            return Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
        }
        let { name, userName, password, confirmPassword } = formData
        const isParent = true
        const exists = await userNameExists(userName)
        if (exists) {
            return Toast.show({
                type: 'error',
                text1: "User name already exists or could not be validated."
            })
        }
        else {
            register({name, userName, password, confirmPassword, isParent})
                .then( () => { 
                    Toast.show({
                        type: 'success',
                        text1: "Account created successfully!"
                    })
                    navigation.navigate('PasscodeVerification', {userName}) 
                })
                .catch( error => {
                    console.log("register error:", error)
                    setApiErrors(prev => ({...prev, register: "Unable to create account."}))
                    Toast.show({
                        type: 'error',
                        text1: "Unable to create account."
                    })
                })
        }
    }

    return (
        <View>
            <Text>Hello, register to get started.</Text>

            <View>

                <View>
                    {formErrors.name && (
                        <Text style={{ color: 'red', textAlign: 'center' }}>
                            {formErrors.name}
                        </Text>
                    )}
                    <Text>First Name:</Text>
                    <TextInput
                        placeholder="First Name"
                        value={formData.name}
                        onChangeText={(text) => handleChange('name', text)}
                    />
                </View>

                <View>
                    {formErrors.userName && (
                        <Text style={{ color: 'red', textAlign: 'center' }}>
                            {formErrors.userName}
                        </Text>
                    )}
                    <Text>Username:</Text>
                    <TextInput
                        placeholder="Please enter your email or phone number."
                        value={formData.userName}
                        onChangeText={(text) => handleChange('userName', text)}
                    />
                </View>

                <View>
                    {formErrors.password && (
                        <Text style={{ color: 'red', textAlign: 'center' }}>
                            {formErrors.password}
                        </Text>
                    )}
                    <Text>Password:</Text>
                    <TextInput
                        placeholder="Password"
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

                {apiErrors.register && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {apiErrors.register}
                    </Text>
                )}
                {apiErrors.checkUserName && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {apiErrors.checkUserName}
                    </Text>
                )}

                <Pressable onPress={handleSubmit}>
                    <Text>Register</Text>
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