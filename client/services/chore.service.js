import axios from 'axios'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'

const BACKEND_API_URL = Constants.expoConfig.extra.BACKEND_API_URL

const CHORE_INSTANCE = axios.create({
    baseURL: `${BACKEND_API_URL}/chore`
})

CHORE_INSTANCE.interceptors.request.use(
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

// uploads before/after photo names to cloudflare and returns their unique filenames.

export const storePhotos = async (photoUri) => {
    console.log("storephotos Service.")
    console.log("photouri", photoUri)
    console.log(typeof photoUri)
    try {
        const formData = new FormData();

        // Get the file extension
        const uriParts = photoUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        // React Native FormData requires this specific format
        formData.append('photo', {
            uri: photoUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`, // or `image/jpeg` for jpg
        });

        console.log('Uploading from URI:', photoUri); // Debug log

        // const response = await axios.post(
        //     `${BACKEND_API_URL}/r2/upload`,
        //     formData,
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //         timeout: 30000,
        //     }
        // );
        const response = await fetch(`${BACKEND_API_URL}/r2/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("response:", response)
        const data = await response.json()
        if (data.success) {
            console.log('Uploaded fileNames:', data.fileName);
            return data.fileName;
        }
    } catch (error) {
        console.error('Upload error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        Alert.alert('Upload Failed', error.response?.data?.error || error.message);
        throw error;
    }
};




// param photos is an array of the names of the before/after pics from mongodb
// returns an array of 2 urls (beforepic and afterpic).
export const retrievePhotos = async (photos) => {
    try {
        const pics = await axios.post(
            `${BACKEND_API_URL}/r2/retrieve`,
            { fileNames: photos }
        );

        if (pics.data && pics.data.success) {
            const urls = pics.data.photos
            Alert.alert("Success", "Image URLs retrieved");
            return urls; // Returns array of URLs: ['url1', 'url2']
        } else {
            Alert.alert("Error", "No photos found");
            return [];
        }
    } catch (error) {
        console.error('Get pic error:', error);
        Alert.alert("Error", error.message || "Failed to get images");
        return [];
    }
};

export const addChore = async (data) => {
    try {
        const RES = await CHORE_INSTANCE.post('/', data)
        return RES.data
    }
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
        throw error.response.data.errors
    }
}

export const updateChore = async (data) => {
    const options = {
        new: true,
        runValidators: true,
    }
    try {
        const RES = await CHORE_INSTANCE.put('/', data)
        return RES.data
    }
    catch (error) {
        throw error.response.data.errors
    }
}