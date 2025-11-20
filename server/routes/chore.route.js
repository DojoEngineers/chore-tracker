import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addChore, getAllChores, getChoreById, getChoresByWorker, deleteAllChores, updateChore,
    deleteChore, getTemplates, getChoresByParents} from "../controllers/chore.controller.js"

const choreRouter = Router()

// for testing:
// choreRouter.route('/all')
//     .get(getAllChores)
//     .delete(deleteAllChores)

choreRouter.route('/')
    .post(protect, addChore)
    .get(protect, getChoreById)
    .put(protect, updateChore)
    //for testing:
    // .delete(deleteChore)

choreRouter.route('/worker')
    .get(protect, getChoresByWorker)

choreRouter.route('/parents')
    .get(protect, getChoresByParents)

choreRouter.route('/templates')
    .get(protect, getTemplates)

export default choreRouter