import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getCurrentUser, getAllUsers, loginUser, registerUser, updateUser, checkUserName } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.route('/all')
    .get( getAllUsers)

userRouter.route('/')
    // .get( getCurrentUser)
    .post( registerUser)
    .put(protect, updateUser)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/currentUser')
    .get(getCurrentUser)

userRouter.route('/checkUserName')
    .get(checkUserName)


export default userRouter
//client services:
// baseURL: import.meta.env.BACKEND_API_URL + "/user"
//server.js:
// app.use( cors( { origin: process.env.CORS_ORIGIN, credentials: true } ) )