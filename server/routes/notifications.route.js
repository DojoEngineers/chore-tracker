
import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getTestPush } from "../controllers/push.controller.js"

const NotificationRouter = Router()

NotificationRouter.route('/test')
    .post(getTestPush)

export default NotificationRouter
