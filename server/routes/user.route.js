import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getCurrentUser, getAllUsers, loginUser, registerUser, updateUser } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.route('/all')
    .get(protect, getAllUsers)
    .put(protect, updateUser)

userRouter.route('/')
    .get(protect, getCurrentUser)
    .post(protect, registerUser)
    .put(protect, updateUser)

userRouter.route('/login')
    .post(protect, loginUser)


export default userRouter
//client services:
// baseURL: import.meta.env.BACKEND_API_URL + "/user"
//server.js:
// app.use( cors( { origin: process.env.CORS_ORIGIN, credentials: true } ) )