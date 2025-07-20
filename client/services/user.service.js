import axios from 'axios'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_INSTANCE = axios.create({
    baseURL: `${Constants.expoConfig.extra.BACKEND_API_URL}/user`
})

USER_INSTANCE.interceptors.request.use(
    async (config) => {
        console.log("intercepting...")
        const user = await AsyncStorage.getItem('user')
        const data = JSON.parse(user)
        if (data) {
            console.log("data", data)
            const token = data.token
            console.log("token", token)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// generate code and send to the person via email or phone
export const register = async data => {
    try {
        const RES = await USER_INSTANCE.post('/', data )
        return RES
    } catch( error ){ throw error.response.data.errors }
}

export const login = async data => {
    try {
        const RES = await USER_INSTANCE.post( '/login', data )
        return RES
    } catch( error ){ throw error.response.data }
}

export const logout = async () => {
    try {
        const RES = await USER_INSTANCE.post( '/logout' )
        return RES
    } catch( error ){ throw error }
}

export const getCurrentUser = async () => {
    try {
        const RES = await USER_INSTANCE.get( '/currentUser' )
        return RES.data
    } catch( error ){ throw error }
}

export const updateUser = async data => {
    const options = {
        new: true,
        runValidators: true,
    }
    try {
        const RES = await USER_INSTANCE.put( '/', data )
        return RES.data
    } 
    catch( error ){ throw error.response.data.errors }
}

export const checkUserName = async (userName) => {
    try {
        const RES = await USER_INSTANCE.get(
            '/checkUserName',
            { params: { userName } }
        )
        return RES.data.exists
    }
    catch( error ){ throw error }
}

export const getFamily = async (data) => {
    try {
        const RES = await USER_INSTANCE.post( '/', data )
        return RES.data
    } catch( error ){ throw error }
}

// Set isActive to false in back end
export const deactivateUser = async () => {
    try {
        const RES = await USER_INSTANCE.put('/deactivate', { active: false })
        return RES.data
    } catch (error) {throw error}
}

// Data is {userName, code}. Set isVerified to true in backend if the usernames and codes match
export const verify = async (data) => {
    try {
        const RES = await USER_INSTANCE.post('/verify', data)
        return RES
    } catch (error) {throw error.response.data.errors}
}

// Generate code, save it in the user object, send to person via text or email
export const resendCode = async (userName) => {
    try {
        const RES = await USER_INSTANCE.post('/resend', { userName })
        return RES.data
    } catch (error) {throw error.response.data.errors}
}