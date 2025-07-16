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

export const getFamily = async () => {
    try {
        const RES = await USER_INSTANCE.get( '/' )
        return RES.data
    } catch( error ){ throw error }
}

export const deactivateUser = async () => {
    try {
        const RES = await USER_INSTANCE.put('/deactivate', { active: false })
        return RES.data
    } catch (error) {throw error}
}