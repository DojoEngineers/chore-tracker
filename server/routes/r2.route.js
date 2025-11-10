import { Router } from 'express';
import { uploadMiddleware, uploadPhoto, getPhotoUrls } from '../controllers/r2.controller.js';

const R2Router = Router()

R2Router.route('/upload')
    .post(uploadMiddleware, uploadPhoto)

R2Router.route('/retrieve')
    .post(getPhotoUrls)

export default R2Router