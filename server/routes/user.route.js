import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getCurrentUser, getFamily, loginUser, registerUser, updateUser, checkUsername } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.route('/all')
    .get( getFamily)

userRouter.route('/')
    // .get( getCurrentUser)
    .post( registerUser)
    .put(protect, updateUser)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/currentUser')
    .get(getCurrentUser)

userRouter.route('/checkUsername')
    .get(checkUsername)


export default userRouter
//client services:
// baseURL: import.meta.env.BACKEND_API_URL + "/user"
//server.js:
// app.use( cors( { origin: process.env.CORS_ORIGIN, credentials: true } ) )