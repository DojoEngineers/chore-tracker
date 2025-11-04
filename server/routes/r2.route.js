import { Router } from "express"
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const R2Router = Router()

//connects to cloudflare's R2 storage
const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const ONE_DAY = 24 * 60 * 60; // 86,400 seconds

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to handle multiple files
export const uploadMiddleware = upload.single('photo');

export const uploadPhoto = async (req, res) => {
    console.log("uploading in server")
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No photo provided'
            });
        }
        const expiresAt = new Date(Date.now() + ONE_DAY * 1000);

        // Generate unique filename
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        });

        await s3Client.send(command);

        res.json({
            success: true,
            fileName: fileName,
            expiresAt: expiresAt.toISOString(),
            message: 'Photo uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload photo',
            details: error.message
        });
    }
};

//  Get presigned URLs for photos (valid for 1 day)
export const getPhotoUrls = async (req, res) => {
    try {
        const { fileNames } = req.body; // Expecting array of filenames

        if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'fileNames array is required'
            });
        }

        const urls = [];
        const expiresAt = new Date(Date.now() + ONE_DAY * 1000);

        // Generate presigned URL for each photo
        for (const fileName of fileNames) {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
            });

            const url = await getSignedUrl(s3Client, command, {
                expiresIn: ONE_DAY
            });

            urls.push({
                fileName,
                url,
                expiresAt: expiresAt.toISOString()
            });
        }

        res.json({
            success: true,
            photos: urls
        });

    } catch (error) {
        console.error('Retrieve error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve photo URLs',
            details: error.message
        });
    }
};

R2Router.route(`/upload`)
    .post(uploadMiddleware, uploadPhoto)

R2Router.route(`/retrieve`)
    .post(getPhotoUrls)

export default R2Router