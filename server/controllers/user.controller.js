
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
export const checkUsername = async (req, res) => {
    console.log("backend checking username")
    try {
        const { username } = req.query;
        console.log("username", username)
        console.log("req", req.query)
        const USER = await User.findOne({ username: username });
        if (!USER) {
            console.log("no user!")
            return res.json({exists: false})
        }
        else {
            console.log("user found!")
            return res.json({exists:true})
        }
        
    } catch (error) {
        res.status(400).json({ message: error.message || 'An error occurred while fetching the profile.' })
    }
}

export const registerUser = async (req, res) => {
    console.log("entered register controller. req.body:", req.body)
    try {
        const user = await User.create({ ...req.body, children: [], parents: [], isVerified: false, isActive: true })
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

// for getting family by user family array. Make it into a post request if you want to send data like arrays or objects.
export const getFamily = async (req, res) => {
    try {

        const ids = req.body; // req.body is an array here
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
        const USERS = await User.find({_id: { $in: objectIds }}).select(`-password`)
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