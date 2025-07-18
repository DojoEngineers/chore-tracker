import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addChore, getAllChores, getChoresByWorker, deleteAllChores, updateChore, deleteChore } from "../controllers/chore.controller.js"

const choreRouter = Router()


choreRouter.route('/all')
    .get( getAllChores )
    .delete ( deleteAllChores)

choreRouter.route('/')
    .post(protect, addChore)
    .get(getChoresByWorker)
    .put(protect, updateChore)
    .delete (deleteChore)


export default choreRouter