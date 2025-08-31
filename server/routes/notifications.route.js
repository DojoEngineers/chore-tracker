
import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import express from "express";
import { sendPush } from "../controllers/notification.controller.js";

const NotificationRouter = Router()

// normally get pushToken from user doc in db. for testing, I'm using the token in async storage from client.

NotificationRouter.route("/")
    .post(async (req, res) => {
        try {
            console.log("in route")
            const { pushToken, choreName } = req.body;
            console.log("push", pushToken)

            // Construct the message (Expo requires `to`, `title`, `body`)
            const message = {
                to: pushToken,
                sound: "default",
                title: "📋 Chore Reminder",
                body: `Don't forget: ${choreName} is due soon!`,
                data: { choreName },
            };

            // Call your utility function
            const result = await sendPush(message);

            res.json({ success: true, result });
        } catch (err) {
            console.error("Error sending push:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

    NotificationRouter.route("/newChore")
    .post(async (req, res) => {
        try {
            console.log("in route newchore")
            const { pushToken, choreName } = req.body;
            console.log("push", pushToken)

            // Construct the message (Expo requires `to`, `title`, `body`)
            const message = {
                to: pushToken,
                sound: "default",
                title: "📋 New Chore created",
                body: `New Chore:${choreName} is due soon!`,
                data: { choreName },
            };

            // Call your utility function
            const result = await sendPush(message);

            res.json({ success: true, result });
        } catch (err) {
            console.error("Error sending push:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

export default NotificationRouter;
