import axios from 'axios'
// import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
// const BACKEND_API_URL = Constants.expoConfig.extra.backendUrl;

const CHORE_INSTANCE = axios.create({
    baseURL: `${process.env.BACKEND_API_URL}/chore`})
    // baseURL: `${Constants.expoConfig.extra.BACKEND_API_URL}/chore`})  
    //     `${BACKEND_API_URL}/chore`})

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

export const addChore = async (data) => {
    try {
        const RES = await CHORE_INSTANCE.post('/', data )
        return RES.data
    }
    catch(error) {
        throw error.response.data.errors
    }
}

export const getChoresByWorker = async (id) => {
    try {
        const RES = await CHORE_INSTANCE.get('/worker', {
            params: { id }
        })
        return RES.data
    }
    catch(error) {
        throw error.response.data.errors
    }
}

export const getChoresByParents = async (parents) => {
    try {
        const RES = await CHORE_INSTANCE.get('/parents', {
            params: { parents }
        })
        return RES.data
    }
    catch(error) {
        throw error.response.data.errors
    }
}

export const getChoreById = async (id) => {
    try {
        const RES = await CHORE_INSTANCE.get('/', {
            params: { id }
        })
        return RES.data
    }
    catch(error) {
        throw error.response.data.errors
    }
}

export const updateChore = async (data) => {
    const options = {
        new: true,
        runValidators: true,
    }
    try {
        const RES = await CHORE_INSTANCE.put( '/', data )
        return RES.data
    } 
    catch( error ){ throw error.response.data.errors }
}