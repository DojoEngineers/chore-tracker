import axios from 'axios'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CHORE_INSTANCE = axios.create({
    baseURL: `${Constants.expoConfig.extra.BACKEND_API_URL}/chore`
})

CHORE_INSTANCE.interceptors.request.use(
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

export const addChore = async data => {
    try {
        const RES = await CHORE_INSTANCE.post('/', data )
        return RES
    }
    catch(error) {
        throw error.response.data.errors
    }
}
