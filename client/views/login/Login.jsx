import { Text, TextInput, View, Pressable } from "react-native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { getCurrentUser, getUserByUsername, login } from "../../services/user.service"
import { useEffect, useState } from "react"

export const Login = () => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState({
        username: '',
        password: ''
        })

    const navigation = useNavigation()
    const { login: loginUser, user, isLoggingOut, isLoggedIn, setLoggedInData } = useLogin()

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

    useEffect(() => {
        console.log("login useEffect")
        // if user is currently logging out or in, we dont want to checkUser() and accidentally log back in.
        if (!user || !user.user || !user.user._id) {
            console.log("No valid user, staying on login page")
            return;
        }
        const timer = setTimeout(() => {
            checkUserToken()
        }, 200); // Give login flow time to navigate first
        return () => clearTimeout(timer)

    }, [user, isLoggingOut, isLoggedIn])

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleLogin = () => {
        getUserByUsername(formData.username)
            .then(res => {
                if (res && res.isVerified && res.passwordReset) {
                    navigation.replace("NewPassword")
                }
                else if (res && res.isVerified) {
                    login(formData)
                        .then(res => {
                            return loginUser(res)
                        })
                        .then(saved => {
                            if (saved) {
                                checkUserToken()
                            }
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
                else if (res){
                    Toast.show({
                        type: 'error',
                        text1: "Account is not verified.",
                        text2: "Verify your account in the registration section."
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: "Username not found."
                    })
                }
            })
            .catch(error => {
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

            {apiErrors.login && (
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    {apiErrors.login}
                </Text>
            )}

            <Text>Welcome</Text>
            <Text>Sign into your account</Text>

            <View>
                <Text>Email:</Text>
                <TextInput
                    placeholder="Email"
                    value={formData.username}
                    onChangeText={(text) => handleChange('username', text)}
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
                <Pressable onPress={() => navigation.navigate('ForgotPassword')}> 
                    <Text>Forgot your password?</Text>
                </Pressable>
            </View>

            <View>
                <Text>Don't have an account?</Text>
                <Pressable onPress={() => navigation.navigate('ChooseAccountType')}> 
                    <Text>Register Now</Text>
                </Pressable>
            </View>

        </View>
    )
}