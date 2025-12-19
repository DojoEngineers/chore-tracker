import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { dbConnect } from "./config/mongoose.config.js";
import userRouter from "./routes/user.route.js"
import choreRouter from "./routes/chore.route.js"
import R2Router from "./routes/r2.route.js"
import NotificationRouter from "./routes/notifications.route.js"
import emailjs from "@emailjs/nodejs"
import { Expo } from 'expo-server-sdk'

const app = express()

app.use(express.json())

app.use(cors())
app.use("/user", userRouter)
app.use("/chore", choreRouter)
app.use("/r2", R2Router)
app.use("/send-push", NotificationRouter)
app.get("/ping", (req, res) => {
  console.log("pinging server...")
  res.sendStatus(200)})

config()
const PORT = process.env.PORT
emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY
});

dbConnect()





//EXPO PUSH NOTIFICATIONS
// Create a new Expo SDK client
// const expo = new Expo();
// Store push tokens (use a database in production)
// let pushTokens = [];
// Endpoint to save push tokens
// app.post('/api/save-push-token', (req, res) => {
  // const { token, userId } = req.body;
  // Validate the token
  // if (!Expo.isExpoPushToken(token)) {
  //   return res.status(400).json({ error: 'Invalid push token' });
  // }
  // Save token (use database in production)
//   pushTokens.push({ token, userId });
  
//   res.json({ success: true });
// });

// Endpoint to send notification
// app.post('/api/send-notification', async (req, res) => {
//   const { title, body, data, userId } = req.body;
  
  // Find user's tokens
  // const userTokens = pushTokens
  //   .filter(item => item.userId === userId)
  //   .map(item => item.token);
  
  // if (userTokens.length === 0) {
  //   return res.status(404).json({ error: 'No tokens found for user' });
  // }
  
  // Create messages
  // const messages = userTokens.map(token => ({
  //   to: token,
  //   sound: 'default',
  //   title,
  //   body,
  //   data,
  // }));
  
  // Send notifications
//   try {
//     const chunks = expo.chunkPushNotifications(messages);
//     const tickets = [];
    
//     for (const chunk of chunks) {
//       const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       tickets.push(...ticketChunk);
//     }
    
//     res.json({ success: true, tickets });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     res.status(500).json({ error: 'Failed to send notifications' });
//   }
// })

app.listen(PORT, '0.0.0.0', async () => {
    console.log("port:", PORT);
    // Line below generates a new instance of reoccuring chores (if chore's conditionas are met)
    // await startJobs();
})