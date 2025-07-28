import User from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js"
// import { Resend } from 'resend';
import emailjs from "@emailjs/nodejs"
import crypto from "crypto"


// for deleting, req.params is best practice but can also use req.body
export const deleteUser = async (req, res) => {
    console.log("id", req.body._id)
    try {
        const deletedUser = await User.findByIdAndDelete(req.body._id)
        res.status(200).json(deletedUser)
    }
    catch (error) {
        console.log("error", error)
        res.status(400).json("no user to delete")
    }
}

export const getAllUsers = async (req, res) => {
    console.log("getting all users")
    try {
        const USERS = await User.find()
        res.status(200).json(USERS)
    } catch (error) {
        console.log("error", error)
        res.status(400).json(error)
    }
}

// when logging in, creates token and saves it (along with id) in async storage. 
export const loginUser = async (req, res) => {
    console.log("in login server controller")
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user && (await user.matchPassword(password))) {
        const data = {
            _id: user._id.toString(),
            username: user.username,
        }
        const token = generateToken(user._id);
        console.log("user data", data)
        console.log("token", token)
        res.status(200).json({
            token: token,
            _id: data._id,
            name: data.name,
            username: data.username
        });
    }
    else { res.status(401).json("User password or email is not valid.") }
}

// checks if username exists in db
export const checkUsername = async (req, res) => {
    console.log("backend checking username")
    try {
        console.log("username", req.query)
        const { username } = req.query
        const USER = await User.findOne({ username }).select("-password")
        if (!USER) {
            console.log("no user!")
            return res.json(false)
        }
        else {
            console.log("dupe user found!")
            return res.json(true)
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}

export const getUserByUsername = async (req, res) => {
    console.log("backend getting user by username")
    try {
        console.log("username", req.query)
        const { username } = req.query
        const USER = await User.findOne({ username }).select("-password")
        if (!USER) {
            console.log("no user!")
            return res.json(false)
        }
        else {
            console.log("user found!")
            return res.json({ isVerified: USER.isVerified, isActive: USER.isActive, passwordReset: USER.passwordReset })
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}

// sends code. can be called from register or resend
export const sendTestEmail = async (name, username, code, expiration) => {
    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {   userEmail: username,
                subject: "Your code to login",
                message: `Hello ${name}. Your code is ${code}. It expires ${expiration}.`
            }
        );
    }
    catch (error) {
        console.log("failed to send email:", error)
    }

};

// adds unverified user to db and sends email with generated code.
export const registerUser = async (req, res) => {
    console.log("entered register controller. req.body:", req.body)

    async function generateCode() {
        // Generate secure random 6-digit code
        return crypto.randomInt(100000, 999999).toString();
    }
    const code = await generateCode()
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    console.log("code", code)
    console.log("expiration", expiration)

    try {
        const user = await User.create({
            ...req.body, children: [], parents: [],
            isVerified: false, isActive: true, verificationCode: code, codeExpirationDate: expiration
        })

        if (user) {
            delete user.password //removes password from the object
            console.log("api key", process.env.EMAILJS_SERVICE_ID)
            sendTestEmail(user.name, user.username, user.verificationCode, user.codeExpirationDate)
            res.json({ success: true, message: 'Email sent!' });
        }
        else {
            console.log("user creation failed")
        }
    }
    catch (error) {
        console.log("register error", error)
        res.status(500).json({ error: error.message });
    }

}

// If requested, resets code in db and resends code to user email.
export const resendCode = async (req, res) => {
    async function generateCode() {
        // Generate secure random 6-digit code
        return crypto.randomInt(100000, 999999).toString();
    }
    const code = await generateCode()

    const user = await User.findOneAndUpdate(
        { username: req.body.username }, { verificationCode: code }
    )
    if (!user) {
        console.log("resend code failed")
        return false
    }
    else {
        console.log("resending. emailjs api key", process.env.EMAILJS_SERVICE_ID)
        console.log("sending to user", user)
        sendTestEmail(user.name, user.username, code, user.codeExpirationDate)
        res.status(200).json(user)
    }

}

// checks if user's inputed code is correct. If it is, we set isVerified to true.
export const verifyUser = async (req, res) => {
    try {
        console.log("verify user. req.body:", req.body)
        // find by username/code that matches. update isVerified boolean.
        const USER = await User.findOneAndUpdate({ username: req.body.username, verificationCode: req.body.verificationCode },
            { isVerified: true }, { new: true }).select(`-password`)
        if (!USER) {
            console.log("wrong code/email")
            return res.status(404).json({ message: 'Wrong code/email' })
        }
        // find by username. update boolean.
        console.log("making token for user:", USER)
        const token = generateToken(USER._id);
        const data = {
            token: token,
            _id: USER._id.toString(),
            username: USER.username,
        }
        console.log("user data", data)
        res.status(200).json(data)
    }
    catch (error) {
        console.log("error", error)
        res.status(400).json({ message: error.message || 'An error occurred while verifying' })
    }
}

// generates a string and resets user's password to the string. 
// Sets passwordReset to true. Emails new password to user.
export const sendPassword = async (req, res) => {
    try {
        const USER = await User.findOne({ username: req.body.username })
        if (!USER) {
            console.log("no user found")
            return false
        }
        async function generatePassword(length = 12) {
            const randomBytes = crypto.randomBytes(length);
            const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+~';
            let password = '';
            for (let i = 0; i < length; i++) {
                const index = randomBytes[i] % CHARSET.length;
                password += CHARSET[index];
            }
            return password;
        }

        const newPw = await generatePassword()
        console.log("newPw", newPw)

        const UPDATED_USER = await User.findOneAndUpdate({ username: USER.username },
            { password: newPw, passwordReset: true }, { new: true }).select("-password")
        // sends email
        console.log("updated user", UPDATED_USER)
        sendTestEmail(UPDATED_USER.name, UPDATED_USER.username, newPw, "never")
        res.status(200).json(UPDATED_USER)
    }
    catch (err) {
        console.log("err", err)
        res.status(400).json({ message: err.message || 'An error occurred while changing password' })
    }
}

// user changes password after logging in with generated password.
export const changePassword = async (req, res) => {
    try {
        console.log("changing pw. req.body:", req.body)
        const USER = await User.findOneAndUpdate({username: req.body.username}, {password: req.body.password, passwordReset: false }, { new: true }).select(`-password`)
        if (!USER) {
            console.log("no user!")
            return res.status(404).json({ message: 'User not found.' })
        }
        console.log("controller pw change success!")
        const token = generateToken(USER._id);
        console.log("token", token)
        res.status(200).json({
            token: token,
            _id: USER._id,
            name: USER.name,
            username: USER.username
        });
    }
    catch (error) {
        console.log("pw change error", error)
        res.status(400).json({ message: error.message || 'An error occurred while changing password' })
    }
}

// after logging in, get's user info
export const getCurrentUser = async (req, res) => {
    try {
        const USER = await User.findById(req.user._id).select(`-password`)
        if (!USER) {
            return res.status(404).json({ message: 'User not found.' })
        }
        res.status(200).json(USER)
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}

// for getting family by user family array. Make it into a post request if you want to send data like arrays or objects.
export const getFamily = async (req, res) => {
    try {

        const ids = req.body; // req.body is an array here
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
        const USERS = await User.find({ _id: { $in: objectIds } }).select(`-password`)
        res.json(USERS);
        res.status(200).json(USERS)
    } catch (error) { res.status(400).json(error) }
}


// Use for "deleting users". Frontend changes user attribute active => inactive
export const updateUser = async (req, res) => {
    console.log("In user controller")
    console.log("user REQ.body", req.body)
    const options = {
        new: true,
        runValidators: true,
    };
    try {
        const editedUser = await User.findByIdAndUpdate(
            req.body._id,
            req.body,
            options
        );
        res.status(200).json(editedUser);
    }
    catch (error) {
        res.status(400).json(error);
        throw error
    }
}