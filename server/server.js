import express from "express";
import cors from "cors";
import { config } from "dotenv"; // instead of importing all of dotenv
import { dbConnect } from "./config/mongoose.config.js";
import userRouter from "./routes/user.route.js"
import choreRouter from "./routes/chore.route.js"
import uploadRouter from "./routes/upload.js";
import cookieParser from "cookie-parser";
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); 
// allows front-end requests coming from the origin (no dubious sources).
cors({ origin: 'http://192.168.1.217:19000', credentials:true })
// 'http://localhost:5173', credentials: true
app.use(express.json())
app.use(cookieParser())
app.use("/v1/user", userRouter);
app.use("/v1/chore", choreRouter);
app.use("/v1/upload", uploadRouter);

// This line serves files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

config(); // instead of dotenv.config
const PORT = process.env.PORT;

dbConnect();

app.listen(PORT, '0.0.0.0', () => {
    console.log("port:", PORT);
});
