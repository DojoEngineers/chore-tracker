import { Router } from "express"
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const R2Router = Router()

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
export const uploadMiddleware = upload.array('photos', 2); // max 2 photos

export const uploadPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No photos provided'
            });
        }

        const uploadedFiles = [];
        const expiresAt = new Date(Date.now() + ONE_DAY * 1000);

        // Upload each photo to R2
        for (const file of req.files) {
            // Generate unique filename
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;

            // Upload to R2
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await s3Client.send(command);
            uploadedFiles.push(fileName);
        }

        res.json({
            success: true,
            fileNames: uploadedFiles,
            expiresAt: expiresAt.toISOString(),
            message: `${uploadedFiles.length} photo(s) uploaded successfully`
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload photos',
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
    .post(uploadPhotos)

R2Router.route(`/retrieve`)
    .post(getPhotoUrls)

export default R2Router