import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = process.env.R2_BUCKET_NAME
const ONE_DAY = 24 * 60 * 60; // 86,400 seconds

// Configure S3/R2 client
const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }
})

// Configure multer for memory storage
const upload = multer({
storage: multer.memoryStorage(),
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Export the middleware for single file upload
export const uploadMiddleware = upload.single('photo')

// ====== CONTROLLERS ======

// Upload photo to R2
export const uploadPhoto = async (req, res) => {
    console.log("Uploading in server")

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No photo provided',
            })
        }

        const expiresAt = new Date(Date.now() + ONE_DAY * 1000);
        const fileExtension = req.file.originalname.split('.').pop()
        const fileName = `${uuidv4()}.${fileExtension}`

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        })

        await s3Client.send(command)

        const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
        })

        const url = await getSignedUrl(s3Client, getCommand, { expiresIn: ONE_DAY })

        res.json({
            success: true,
            photo: {
                fileName,
                url,
                expiresAt: expiresAt.toISOString(),
            },
            message: 'Photo uploaded successfully',
        })

    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to upload photo',
            details: error.message,
        })
    }
}

// Retrieve signed URLs for photos
export const getPhotoUrls = async (req, res) => {
    try {
        const { fileNames } = req.body

        if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'fileNames array is required',
            })
        }

        const urls = []
        const expiresAt = new Date(Date.now() + ONE_DAY * 1000)

        for (const fileName of fileNames) {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
            })

            const url = await getSignedUrl(s3Client, command, { expiresIn: ONE_DAY })

            urls.push({
                fileName,
                url,
                expiresAt: expiresAt.toISOString(),
            })
        }

        res.json({
            success: true,
            photos: urls,
        })

    } catch (error) {
        console.error('Retrieve error:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve photo URLs',
            details: error.message,
        })
    }
}