import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { deleteUser, getUser, getUsers, loginUser, registerUser, updateUser } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.route('/all')
    .get( getUsers )
    .delete (deleteUser)
    .put(updateUser)

userRouter.route('/')
    .get( protect, getUsers )
    .post( registerUser )
    // .put (edit?)
    

userRouter.route('/logins')
    .post (getUser)

userRouter.route('/login')
    .post( loginUser )


export default userRouter
//client services:
// baseURL: import.meta.env.BACKEND_API_URL + "/user"
//server.js:
// app.use( cors( { origin: process.env.CORS_ORIGIN, credentials: true } ) )