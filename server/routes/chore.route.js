import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addChore, getAllChores, getChoreById, getChoresByWorker, deleteAllChores, updateChore, deleteChore, getTemplates, getChoresByParent } from "../controllers/chore.controller.js"

const choreRouter = Router()


choreRouter.route('/all')
    .get(getAllChores)
    .delete(deleteAllChores)

choreRouter.route('/')
    // add protect after done testing
    .post(addChore)
    .get(getChoreById)
    .put(protect, updateChore)
    .delete(deleteChore)

    
choreRouter.route('/worker')
    .get(getChoresByWorker)

choreRouter.route('/parents')
    .get(getChoresByParent)


choreRouter.route('/templates')
    .get(getTemplates)

export default choreRouter