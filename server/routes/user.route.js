import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getCurrentUser, loginUser, registerUser, updateUser, checkUsername, getUserByUsername, verifyUser, verifyPassword,
    changePassword, resendCode, sendPassword, deleteUser, getAllUsers } from "../controllers/user.controller.js"

const userRouter = Router()

// for testing:
userRouter.route('/all')
    .get(getAllUsers)

userRouter.route('/')
    .get(protect, getCurrentUser)
    .post(registerUser)
    .put(protect, updateUser)
    //for testing:
    .delete(deleteUser)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/currentUser')
    .get(protect, getCurrentUser)

userRouter.route('/checkUsername')
    .get(checkUsername)

userRouter.route('/getUserByUsername')
    .get(getUserByUsername)

userRouter.route('/verify')
    .post(verifyUser)

    userRouter.route('/verifyPassword')
    .get(protect, verifyPassword)

userRouter.route('/resendCode')
    .post(resendCode)

userRouter.route('/sendPassword')
    .post(sendPassword)

userRouter.route('/changePassword')
    .put(changePassword)

export default userRouter