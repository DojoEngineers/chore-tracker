import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addChore, getAllChores, getChoresByWorker, deleteAllChores, updateChore, deleteChore, getTemplates } from "../controllers/chore.controller.js"

const choreRouter = Router()


choreRouter.route('/all')
    .get( getAllChores )
    .delete ( deleteAllChores)

choreRouter.route('/')
// add protect after done testing
    .post(addChore)
    .get(getChoresByWorker)
    .put(protect, updateChore)
    .delete (deleteChore)

choreRouter.route('/templates')
    .get(getTemplates)

export default choreRouter