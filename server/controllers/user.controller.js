
import User from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js"


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
            token,
            user: {
                _id: data._id,
                name: data.name,
                username: data.username,
            },
        });
    }
    else { res.status(401).json("User password or email is not valid.") }
}

// checks if username exists in db
export const checkUserName = async (req, res) => {
    try {
        console.log("req", req.query)
        const USER = await User.findOne({ username: req.query });
        if (!USER) {
            return res.status(404).json({ message: 'User not found.' })
        }
        res.status(200).json(USER)
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}

export const registerUser = async (req, res) => {
    console.log("entered register controller. req.body:", req.body)
    try {
        const user = await User.create({...req.body, children: [], parents: [], choresCompleted:[], isVerified: false, isActive: true })
        delete user.password //removes password from the object
        const token = generateToken(user._id);
        const data = {
            _id: user._id.toString(),
            username: user.username,
        }
        console.log("user data", data)
        console.log("token", token)
        res.status(200).json({
            token,
            user: {
                _id: data._id,
                name: data.name,
                username: data.username,
            },
        });

    } catch (error) {
        console.log("register controller error", error)
        res.status(400).json(error)
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

// for getting family. front-end will filter out.
export const getAllUsers = async (req, res) => {
    try {
        const USERS = await User.find().select(`-password`)
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