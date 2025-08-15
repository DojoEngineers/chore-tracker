import Chore from "../models/chore.model.js"

// for testing only. I use postman to reset db.
export const deleteAllChores = async (req, res) => {
    console.log("delting all chores in controller")
    try {
        const del = await Chore.delete()
        res.status(200).json(del)
    } catch (error) {
        console.log("error", error)
        res.status(400).json(error)
    }
}
// for testing only
export async function deleteChore(req, res) {
    try {
        const deleted = await Chore.findByIdAndDelete(req.body);
        res.status(200).json(deleted);
    } catch (error) {
        res.status(400).json(error);
    }
}

// for testing only 
export const getAllChores = async (req, res) => {
    console.log("getting all chores in controller")
    try {
        const CHORES = await Chore.find()
        console.log("chores", CHORES)
        res.status(200).json(CHORES)
    } catch (error) {
        console.log("error", error)
        res.status(400).json(error)
    }
}

// gets all the chores whose worker id matches the id in the req.
// req.query is used for get requests (other requests use req.body)
export async function getChoresByWorker(req, res) {
    console.log("controller get worker chores")
    console.log("req.query", req.query)
    try {
        const some = await Chore.find({ worker: req.query });
        console.log("some", some)
        res.status(200).json(some);
    } catch (error) {
        console.log("can't get workers chores");
        res.status(400).json(error);
    }
}

export async function getChoresByCreator(req, res) {
    console.log("controller get creator chores")
    console.log("req.query", req.query)
    try {
        const some = await Chore.find({ creator: req.query });
        console.log("some", some)
        res.status(200).json(some);
    } catch (error) {
        console.log("can't get creator chores");
        res.status(400).json(error);
    }
}

export const addChore = async (req, res) => {
    console.log("addChore controller. req.body:", req.body)
    try {
        if (req.body.repeat == "never") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true, })
            res.status(201).json(CHORE)
        }
        else if (req.body.repeat == "daily") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true, })
            console.log("running cron job. Daily.")
            res.status(201).json(CHORE)
        }
        else if (req.body.repeat == "daily") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true, })
            console.log("running cron job. Daily.")
            res.status(201).json(CHORE)
        }
        else if (req.body.repeat == "weekly") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true, })
            console.log("running cron job. Weekly.")
            res.status(201).json(CHORE)
        }
        else if (req.body.repeat == "monthly") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true, })
            console.log("running cron job. Monthly.")
            res.status(201).json(CHORE)
        }

    } catch (error) {
        console.log("addChore controller error", error)
        res.status(400).json(error)
    }
}


// for adding chore pics, changing details, marking as complete, "deleting" by setting to inactive etc.
export const updateChore = async (req, res) => {
    console.log("edit Chore controller. req.body:", req.body)
    try {
        // can't change id or creator
        const allowedUpdates = ['title', "details", 'status', "worker", "dueDate", "dateCompleted", "beforePic", "afterPic", "isActive", "needsPics"]; // Define what can be updated
        const updateData = {};
        // Only include allowed fields that exist in req.body
        // Not sure if line 74 works
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        const CHORE = await Chore.findByIdAndUpdate(req.body._id, { $set: updateData }, { new: true }).select('-password');
        res.status(201).json(CHORE)
    } catch (error) {
        console.log("edit Chore controller error", error)
        res.status(400).json(error)
    }
}