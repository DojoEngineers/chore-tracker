import { Router } from 'express';
import { uploadMiddleware, uploadPhoto, getPhotoUrls } from '../controllers/r2.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const R2Router = Router()

R2Router.route('/upload')
    .post(protect, uploadMiddleware, uploadPhoto)

R2Router.route('/retrieve')
    .post(protect, getPhotoUrls)

export default R2Router