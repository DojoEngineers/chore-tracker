import axios from 'axios'
import Constants from 'expo-constants'

const R2_INSTANCE = axios.create({
    baseURL: `${Constants.expoConfig.extra.BACKEND_API_URL}/r2`
})

// uploads before/after photo names to cloudflare and returns their unique filenames.

export const storePhotos = async (photoUri) => {
    try {
        const formData = new FormData()

        // Get the file extension
        const uriParts = photoUri.split('.');
        const fileType = uriParts[uriParts.length - 1]

        // React Native FormData requires this specific format
        formData.append('photo', {
            uri: photoUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`, // or `image/jpeg` for jpg
        })

        const RES = await R2_INSTANCE.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

        if (RES.data.success) {
            return RES.data.photo
        }

    } catch (error) {
        console.error('Upload error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        })
        throw error
    }
}

// param photos is an array of the names of the before/after pics from mongodb
// returns an array of 2 urls (beforepic and afterpic).
export const retrievePhotos = async (photos) => {
    try {
        const RES = await R2_INSTANCE.post('/retrieve', { fileNames: photos })

        if (RES.data.success) {
            return RES.data.photos // Returns array of URLs: ['url1', 'url2']
        } else {
            return []
        }

    } catch (error) {
        console.error('Get pic error:', error)
        return []
    }
};