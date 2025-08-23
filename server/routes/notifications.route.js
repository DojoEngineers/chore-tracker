
import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"


const NotificationRouter = Router()


NotificationRouter.route('https://exp.host/--/api/v2/push/send')
    .get(getAllChores)
    .delete(deleteAllChores)
