
import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getTestPush } from "../controllers/push.controller.js"

const NotificationRouter = Router()

NotificationRouter.route('/test')
    // You can't .post(getTestPush) directly. You need this wrapper for the push notifications to work.
    .post(async (req, res) => {
        const { token, title, body } = req.body;
        const result = await getTestPush(token, title, body, {});
        res.json(result);
    });

export default NotificationRouter
