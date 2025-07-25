import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getCurrentUser, getFamily, loginUser, registerUser, updateUser, checkUsername, verifyUser, changePassword, resendCode, sendPassword, deleteUser, getAllUsers } from "../controllers/user.controller.js"
// import { verify } from "jsonwebtoken"

const userRouter = Router()

userRouter.route('/each')
    .get(getAllUsers)

userRouter.route('/all')
    .get(getFamily)

userRouter.route('/')
    // .get( getCurrentUser)
    .post(registerUser)
    .put(protect, updateUser)
    //for testing:
    .delete(deleteUser)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/currentUser')
    .get(getCurrentUser)

userRouter.route('/checkUsername')
    .get(checkUsername)

userRouter.route('/verify')
    .post(verifyUser)

userRouter.route('/resendCode')
    .post(resendCode)

userRouter.route('/sendPassword')
    .post(sendPassword)

userRouter.route('/changePassword')
    .put(changePassword)


export default userRouter