import express from "express";
import multer from "multer";
import path from "path";
import { addImage } from "../controllers/image.controller.js";

const imageRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    cb(null, uniqueName);
  }
})

function imageFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

imageRouter.route('/')
    .post(upload.single('image'), addImage)

export default imageRouter