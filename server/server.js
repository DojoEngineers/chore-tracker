import express from "express";
import cors from "cors";
import { config } from "dotenv"; // instead of importing all of dotenv
import { dbConnect } from "./config/mongoose.config.js";
import userRouter from "./routes/user.route.js"
import choreRouter from "./routes/chore.route.js"
import uploadRouter from "./routes/upload.js";
import path from 'path'
import { fileURLToPath } from 'url';
import emailjs from "@emailjs/nodejs"
import { startJobs } from "./agenda.js";
import agenda from "./agenda.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY
});

const app = express();

app.use(express.json()); 
// allows front-end requests coming from the origin (no dubious sources).
cors({ origin: process.env.FRONTEND_API_URL, credentials:true })
// 'http://localhost:5173', credentials: true
app.use(express.json())
app.use("/user", userRouter);
app.use("/chore", choreRouter);
app.use("/upload", uploadRouter);



// This line serves files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

config(); // instead of dotenv.config
const PORT = process.env.PORT;

dbConnect();


app.listen(PORT, '0.0.0.0', async () => {
    console.log("port:", PORT);
    // Line below generates a new instance of reoccuring chores (if chore's conditionas are met)
    // await startJobs();
    
});
