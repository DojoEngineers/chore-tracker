
import User from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js"
import { Resend } from 'resend';
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

export const getAllUsers = async(req, res) => {
    console.log("getting all users")
    try {
        const USERS = await User.find()
        res.status(200).json(USERS)
    } catch (error) { 
        console.log("error", error)
        res.status(400).json(error) }
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
                username: data.username});
    }
    else { res.status(401).json("User password or email is not valid.") }
}

// checks if username exists in db
export const checkUsername = async (req, res) => {
    console.log("backend checking username")
    try {
        console.log("username", req.query)
        const {username} = req.query
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
        const {username} = req.query
        const USER = await User.findOne({ username }).select("-password")
        if (!USER) {
            console.log("no user!")
            return res.json(false)
        }
        else {
            console.log("user found!")
            return res.json({isVerified: USER.isVerified, isActive: USER.isActive, passwordReset: USER.passwordReset})
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}

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
        delete user.password //removes password from the object
        console.log("api key", process.env.RESEND_API)
        const resend = new Resend(`${process.env.RESEND_API}`);

        async function sendEmail(yourCode, expires) {
            const { emailData, emailError } = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: [`${user.username}`],
                subject: 'Testing code',
                html: `<strong>Hello! Your code is ${yourCode}. It expires: ${expires}.</strong>`,
            });
            if (emailError) {
                console.log("email err", emailError)
            }
        }
        sendEmail(code, expiration)
        res.status(200).json(user);

    } catch (error) {
        console.log("register controller error", error)
        res.status(400).json(error)
    }
}

// If requested, resets code in db and resends code to user email.
export const resendCode = async (req, res) => {
    async function generateCode() {
        const bytes = await Random.getRandomBytesAsync(4);
        const number = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
        const code = Math.abs(number % 900000) + 100000; // Ensures a 6-digit number
        return code.toString();
    };
    const code = generateCode()

    const USER = User.findOneAndUpdate(
        { username: req.body.username }, { verificationCode: code }
    )
    if (!USER) {
        return false
    }
    // send email here

    res.status(200).json(USER)
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
// Sets passwordRequest to true. Emails new password to user.
export const sendPassword = async (req, res) => {
    try {
        const USER = findOne({ username: req.body.username })
        if (!USER) {
            return false
        }
        async function generatePassword(length = 12) {
            const randomBytes = await Random.getRandomBytesAsync(length);
            const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
            let password = '';

            for (let i = 0; i < length; i++) {
                const index = randomBytes[i] % CHARSET.length;
                password += CHARSET[index];
            }
            return password;
        }
        const newPw = generatePassword()
        console.log("newPw", newPw)
        const UPDATED_USER = User.findOneAndUpdate({ username: USER.username }, { password: newPw })
        res.status(200).json(UPDATED_USER)
    }
    catch (err) {
        console.log("err", err)
        res.status(400).json({ message: err.message || 'An error occurred while changing password' })
    }
}

export const changePassword = async (req, res) => {
    try {
        console.log("changing pw. req.body:", req.body)
        const USER = await User.findByIdAndUpdate({ _id: req.body._id, password: req.body.password }).select(`-password`)
        if (!USER) {
            return res.status(404).json({ message: 'User not found.' })
        }
        res.status(200).json(USER)
    }
    catch (error) {
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