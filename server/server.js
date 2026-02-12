import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { dbConnect } from "./config/mongoose.config.js";
import userRouter from "./routes/user.route.js"
import choreRouter from "./routes/chore.route.js"
import R2Router from "./routes/r2.route.js"
import NotificationRouter from "./routes/notifications.route.js"
import emailjs from "@emailjs/nodejs"
import { initAgenda, startJobs } from "./agenda.js";

config()
const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cors())

app.use("/user", userRouter)
app.use("/chore", choreRouter)
app.use("/r2", R2Router)
app.use("/send-push", NotificationRouter)

app.get("/ping", (req, res) => {
  console.log("pinging server...")
  res.sendStatus(200)
})

emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY
});

await dbConnect()

await initAgenda()

app.listen(PORT, '0.0.0.0', async () => {
    console.log("port:", PORT)
    // Generate all reoccuring chores that should exist when server starts
    await startJobs()
})