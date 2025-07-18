// routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";

const uploadRouter = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb's 2 params are error (null) and result ('uploads/')
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // file.originalname = name of user's pic // file.fieldname = name of input field on form.
    // I'm using file.fieldname so that users cannot inject malicous script into the name.
    // This format below preserves the file extension (.jpg) so the broswer knows what to render
    const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    cb(null, uniqueName);
  }
});

// Only uploads images (no malicious stuff)
function imageFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // accept the file
    } else {
      cb(new Error('Only image files are allowed!'), false); // reject the file
    }
  }

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});
// Only takes files 5MB or smaller


// Route to handle upload ( upload.single means only 1 file)
//Adding a consolelog made the image send but only because of a timeing issue. I fixed it by...

uploadRouter.post('/', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const imagePath = `/uploads/${req.file.filename}`;
    console.log("imagepath in server:", imagePath)
    res.json({ imagePath });
  });


// const fs = require('fs').promises;
// const path = require('path');
// uploadRouter.post('/', upload.single('image'), async (req, res) => {
//     if (!req.file) return res.status(400).send('No file uploaded.');
//     const imagePath = `/uploads/${req.file.filename}`;
//     const fullPath = path.join(__dirname, '../uploads', req.file.filename);
//     try {
//         // Verify file was actually written
//         await fs.access(fullPath);
//         res.json({ imagePath });
//     } catch (error) {
//         res.status(500).json({ error: 'File upload failed' });
//     }
// });


  export default uploadRouter
  //NOTE: I had to make the uploads folder from inside my terminal from tiny_quiz's root path: mkdir -p server/uploads
// If I tried to just make a folder using my VScode sidebar, my app couldn't find it!


