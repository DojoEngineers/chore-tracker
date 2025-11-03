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
export const storePhotos = async (photoUris) => {
    try {
        const formData = new FormData();
        
        // Loop through each photo URI and add to formData
        for (let i = 0; i < photoUris.length; i++) {
            const uriParts = photoUris[i].split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('photos', {
                uri: photoUris[i],
                name: `photo${i}.${fileType}`, // Temporary name, backend will generate UUID
                type: `image/${fileType}`,
            });
        }

        // Upload to your server
        const response = await axios.post(
            `${BACKEND_API_URL}/r2/upload`, 
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
            }
        );

        if (response.data.success) {
            // Backend returns the UUID filenames it generated
            console.log('Uploaded fileNames:', response.data.fileNames);
            return response.data.fileNames;
        }
    } catch (error) {
        console.error('Upload error:', error);
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
            const urls = pics.data.photos.map(photo => photo.url);
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
    catch( error ){
        throw error.response.data.errors
    }
}