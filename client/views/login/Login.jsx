import { Text, TextInput, View, Pressable } from "react-native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { login } from "../../services/user.service"
import { useState } from "react"

export const Login = () => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
        })

    const navigation = useNavigation()
    const { login: loginUser } = useLogin()

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleLogin = () => {
        login(formData)
            .then(async res => {
                loginUser(res)
                setLoggedInData(await getCurrentUser())
                Toast.show({
                    type: 'success',
                    text1: "Login successfully!"
                })
                navigation.replace('Home')
            })
            .catch(error => {
                console.log("login error:", error)
                setApiErrors(prev => ({...prev, login: "Unable to login."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to login."
                })
            })
    }

    return (
        <View>

            {apiErrors.login && (
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    {apiErrors.login}
                </Text>
            )}

            <Text>Welcome</Text>
            <Text>Sign into your account</Text>

            <View>
                <Text>Username:</Text>
                <TextInput
                    placeholder="Email or Phone"
                    value={formData.userName}
                    onChangeText={(text) => handleChange('userName', text)}
                />
            </View>

            <View>
                <Text>Password:</Text>
                <TextInput
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                />
            </View>

            <Pressable onPress={handleLogin}> 
                <Text>Login</Text>
            </Pressable>

            <View>
                <Text>Don't have an account?</Text>
                <Pressable onPress={() => navigation.navigate('ChooseAccountType')}> 
                    <Text>Register Now</Text>
                </Pressable>
            </View>

        </View>
    )
}