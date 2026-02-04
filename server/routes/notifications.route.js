
import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getTestPush } from "../controllers/push.controller.js"

const NotificationRouter = Router()

NotificationRouter.route('/test')
    // You can't .post(getTestPush) directly. You need this wrapper for the push notifications to work.
    .post(async (req, res) => {
        const { id, title, body, data={} } = req.body;
        const result = await getTestPush(id, title, body, data);
        res.json(result);
    });

export default NotificationRouter
