import axios from 'axios'

const USER_INSTANCE = axios.create({
    baseURL: import.meta.env.BACKEND_API_URL + "/user",
    withCredentials: true
})

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

export const getProfile = async () => {
    try {
        const RES = await USER_INSTANCE.get( '/profile' )
        return RES.data
    } catch( error ){ throw error }
}

export const updateUser = async (req, res) => {
    const options = {
        new: true,
        runValidators: true,
    }
    try {
        const RES = await USER_INSTANCE.put( '/', req )
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