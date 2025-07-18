import Chore from "../models/chore.model.js"

// for testing only. I use postman to reset db.
export const deleteAllChores = async(req, res) => {
    console.log("delting all chores in controller")
    try {
        const del = await Chore.deleteMany({})
        res.status(200).json(del)
    } catch (error) { 
        console.log("error", error)
        res.status(400).json(error) }
}
// for testing only
export async function deleteChore(req, res) {
    try {
        const deleted = await Chore.findByIdAndDelete(req._id);
        res.status(200).json(deleted);
    } catch (error) {
        res.status(400).json(error);
    }
}

// for now, we can filter out in front-end. 
export const getAllChores = async(req, res) => {
    console.log("getting all chores in controller")
    try {
        const CHORES = await Chore.find()
        console.log("chores", CHORES)
        res.status(200).json(CHORES)
    } catch (error) { 
        console.log("error", error)
        res.status(400).json(error) }
}

// gets all the chores whose worker id matches the id in the req.
// req.query is used for get requests (other requests use req.body)
export async function getChoresByWorker(req, res) {
    console.log("controller get some chores")
    console.log("req.query", req.query.worker)
    try {
        const some = await Chore.find({ worker: req.query.worker });
        console.log("some", some)
        res.status(200).json(some);
    } catch (error) {
        console.log("can't get workers chores");
        res.status(400).json(error);
    }
}

export const addChore = async(req, res) => {
    console.log("addChore controller. req.body:", req.body)
    try {
        const CHORE = await Chore.create(req.body)
        res.status(201).json( CHORE )
    } catch (error){
        console.log("addChore controller error", error)
        res.status(400).json(error) }
}

// for adding chore pics, changing details etc.
export const updateChore = async(req, res) => {
    console.log("edit Chore controller. req.body:", req.body)
    try {
        const CHORE = await Chore.findByIdAndUpdate(req.body._id, { $set: {afterPic: req.body.pic} }, { new: true })
        res.status(201).json( CHORE )
    } catch (error){
        console.log("edit Chore controller error", error)
        res.status(400).json(error) }
}