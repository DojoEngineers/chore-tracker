import User from "../models/user.model.js"
import Family from "../models/family.model.js"
import { generateToken } from "../utils/generateToken.js"
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
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(401).json("User not found")
    }
    if (await user.matchPassword(password)) {
        console.log("pw match. generating login token")
        const token = generateToken(user._id)
        console.log("token made...")
        res.status(200).json({
            token,
            user: {
                _id: user._id.toString(),
                username: user.username,
                name: user.name,
                passwordReset: user.passwordReset,
                firstLogin: user.firstLogin,
                isVerified: user.isVerified,
                isActive: user.isActive
            }
        })
    }
    else {
        console.log("wrong username/password") 
        res.status(401).json("User password or email is not valid.") }
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

// new function that uses code template in email.js
export const sendCodeEmail = async (name, username, passcode, expiration) => {
    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_CODE_TEMPLATE_ID,
            {
                email: username,
                name,
                passcode,
                expiration
            }
        );
    }
    catch (error) {
        console.log("failed to send email:", error)
    }

};

// new function that uses resetpassword template in email.js
export const sendPasswordEmail = async (name, username, password) => {
    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_PASSWORD_RESET_TEMPLATE_ID,
            {
                email: username,
                name,
                password
            },
            {
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
        );
    }
    catch (error) {
        console.log("failed to send email:", error)
    }
};


// adds unverified user to db, creates family doc if there isn't any, links family doc to user and sends email with generated code.
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
            ...req.body,
            isVerified: false, isActive: true, verificationCode: code, codeExpirationDate: expiration, pushTokens:[]
        })
        if (user) {
            delete user.password //removes password from the object
        }
        // create family doc
        if (!req.body.family) {
            const family = await Family.create({
                parents: [user._id],
                children: []
            });
            user.family = family._id;
            await user.save();
        }
        // Or add to existing family
        else {
            const updatedFamily = await Family.findByIdAndUpdate(req.body.family, user.isParent
                ? { $addToSet: { parents: user._id } }
                : { $addToSet: { children: user._id } },

                { new: true });
            console.log("updated family", updatedFamily)
        }
        sendCodeEmail(user.name, user.username, user.verificationCode, user.codeExpirationDate)
        res.json({ success: true, message: 'Email sent!', user });
    }
    catch (error) {
        console.log("register error", error)
        res.status(500).json({ error: error.message });
    }
}

//Not in use
// export const addUser = async (req, res) => {
//     async function generateCode() {
//         return crypto.randomInt(100000, 999999).toString();
//     }
//     const code = await generateCode()
//     const expiration = new Date(Date.now() + 15 * 60 * 1000);
//     console.log("code", code)
//     console.log("expiration", expiration)
//     try {
//         const user = await User.create({
//             ...req.body, isActive: true, verificationCode: code, codeExpirationDate: expiration})

//         if (user) {
//             delete user.password
//             console.log("api key", process.env.EMAILJS_SERVICE_ID)
//             const family = await Family.findByIdAndUpdate(req.body.family, user.isParent
//                 ? { $addToSet: { parents: user._id } }
//                 : { $addToSet: { children: user._id } },
//                 { new: true });
//             console.log("family", family)
//             sendTestEmail(user.name, user.username, user.verificationCode, user.codeExpirationDate)
//             res.json({ success: true, message: 'Email sent!' });
//         }
//         else {
//             console.log("user creation failed")
//         }
//     }
//     catch (error) {
//         console.log("register error", error)
//         res.status(500).json({ error: error.message });
//     }
// }

// If requested, resets code in db and resends code to user email.

export const resendCode = async (req, res) => {
    async function generateCode() {
        // Generate secure random 6-digit code
        return crypto.randomInt(100000, 999999).toString();
    }
    const code = await generateCode()
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    const user = await User.findOneAndUpdate(
        { username: req.body.username }, { verificationCode: code, codeExpirationDate: expiration },
        { new: true, runValidators: true }
    )
    if (!user) {
        console.log("resend code failed")
        return false
    }
    else {
        console.log("resending. emailjs api key", process.env.EMAILJS_SERVICE_ID)
        console.log("code", code)
        console.log("sending to user", user)
        sendCodeEmail(user.name, user.username, code, user.codeExpirationDate)
        res.status(200).json(user)
    }

}

// checks if user's inputed code is correct. If it is, we set isVerified to true.
export const verifyUser = async (req, res) => {
    try {
        console.log("verify user. req.body:", req.body)
        // find by username/code that matches. update isVerified boolean.
        const USER = await User.findOneAndUpdate({
            username: req.body.username, verificationCode: req.body.verificationCode,
            codeExpirationDate: { $gt: new Date() }
        },
            { isVerified: true, passwordReset: true }, { new: true, runValidators: true }).select(`-password`)
        if (!USER) {
            console.log("wrong code/email")
            return res.status(404).json({ message: 'Wrong code/email' })
        }
        res.status(200).json({ username: USER.username })
    }
    catch (error) {
        console.log("error", error)
        res.status(400).json({ message: error.message || 'An error occurred while verifying' })
    }
}

// checks if inputted pw is correct (used before changing pw or deleting account)
export const verifyPassword = async (req, res) => {
    console.log("name", req.query.username)
    console.log("pw", req.query.password)
    try {
        const USER = await User.findOne({ username: req.query.username })
        if (!USER) {
            console.log("no user found")
            return res.json(false)
        }
        else {
            const isMatch = await USER.matchPassword(req.query.password)
            if (!isMatch) {
                return res.json(false)
            }
            console.log("verified...")
            return res.json(true)
        }
    }
    catch (error) {
        console.log("verify pw error", error)
        throw error
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
        const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
        const UPDATED_USER = await User.findOneAndUpdate({ username: USER.username },
            { password: newPw, passwordReset: true, codeExpirationDate: expiration }, { new: true, runValidators: true }).select("-password")
        // sends email
        console.log("updated user", UPDATED_USER)
        sendPasswordEmail(UPDATED_USER.name, UPDATED_USER.username, newPw)
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
        const USER = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.password, confirmPassword: req.body.confirmPassword, passwordReset: false }, { new: true, runValidators: true }).select(`-password`)
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

// after logging in, get's user info (and use deep population to fetch family data as well).
// if not mutating the const, add .lean() to return as a JS object and improve speed.
export const getCurrentUser = async (req, res) => {
    try {
        const USER = await User.findById(req.user._id).select(`-password`).populate({
            path: 'family',
            populate: [
                { path: 'children', model: "User", select: "name username _id isActive pushTokens" },
                { path: 'parents', model: "User", select: "name username _id isActive pushTokens" }
            ]
        }).lean();
        if (!USER) {
            return res.status(404).json({ message: 'User not found.' })
        }
        console.log("user and family", USER)
        res.status(200).json(USER)
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}


//Not in use
// export const getFamily = async (req, res) => {
//     try {
//         const ids = req.body; 
//         const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
//         const USERS = await User.find({ _id: { $in: objectIds } }).select(`-password`)
//         res.json(USERS);
//         res.status(200).json(USERS)
//     } catch (error) { res.status(400).json(error) }
// }


// Use for "deleting users". Frontend changes user attribute active => inactive
export const updateUser = async (req, res) => {
    console.log("In user controller")
    console.log("user REQ.body", req.body)
    try {
        const id = req.body.id || req.user.id

        // If pushTokens is being updated, use $addToSet to prevent duplicates
        let updateData = { ...req.body };
        if (req.body.pushTokens) {
            updateData = { $addToSet: { pushTokens: req.body.pushTokens } };
        }

        const editedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(editedUser);
    }
    catch (error) {
        res.status(400).json(error);
        throw error
    }
}