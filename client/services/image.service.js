import axios from 'axios'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const IMAGE_INSTANCE = axios.create({
    baseURL: `${Constants.expoConfig.extra.BACKEND_API_URL}/image`
})

IMAGE_INSTANCE.interceptors.request.use(
    async (config) => {
        const user = await AsyncStorage.getItem('user')
        const data = JSON.parse(user)
        if (data) {
            const token = data.token
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

export const addImage = async (imageUri) => {
    const formData = new FormData()
    formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
    })

    try {
        const RES = await IMAGE_INSTANCE.post('/', formData)
        return RES.data
    } catch (error) {
        throw error.response.data.errors
    }
}
