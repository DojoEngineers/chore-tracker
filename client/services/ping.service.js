import axios from "axios";
import Constants from 'expo-constants'

const PING_INSTANCE = axios.create({
    baseURL: `${Constants.expoConfig.extra.BACKEND_API_URL}`
})

export const pingServer = async () => {
    try {
        const RES = await PING_INSTANCE.get("/ping")
        return RES.status === 200
    } catch (error) {
        return false
    }
}