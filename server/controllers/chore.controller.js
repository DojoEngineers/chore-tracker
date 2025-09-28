import Chore from "../models/chore.model.js"
import ChoreTemplate from "../models/choreTemplate.js"


export const seedDB = async (req,res) => {
    try {
        const seed = await Chore.create({
    "creator": "689039957f119be3786358cc",
    "worker": "68903c317f119be3786358da",
    "title":"help work",
    "details":"1hr",
    "repeat": "never",
    "dueDate": "2025-08-04T04:50:57.579Z",
    "needsPics": false,
    "isActive": true,
    "stage": "incomplete"
})
    res.status(200).json(seed)
    }
    catch (error) {
        console.log("error", error)
        res.status(400).json(error)
    }
}

// templates are used to generate an instance of a reoccurring chore.
export const getTemplates = async (req, res) => {
    console.log("getting temps...")
    try {
        const temps = await ChoreTemplate.find()
        res.status(200).json(temps)
    } catch (error) {
        console.log("error", error)
    }
}

// for testing only. I use postman to reset db.
export const deleteAllChores = async (req, res) => {
    console.log("deleting all chores in controller")
    try {
        const del = await Chore.deleteMany()
        res.status(200).json(del)
    } catch (error) {
        console.log("error", error)
        res.status(400).json(error)
    }
}

export async function deleteChore(req, res) {
    try {
        const deleted = await Chore.findByIdAndUpdate(req.body._id, {isActive: false}, {new:true});
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

// query contains _id string
export async function getChoreById(req, res) {
    console.log("controller get chore by id")
    console.log("req.query.id", req.query.id)
    try {
        const one = await Chore.findOne({_id: req.query.id, isActive: true}).populate(
            [{ path: 'creator', model: "User", select: "name _id" },
            { path: 'worker', model: "User", select: "name _id" }
            ])
        console.log("one", one)
        res.status(200).json(one);
    } catch (error) {
        console.log("can't get chore");
        res.status(400).json(error);
    }
}

// gets all the chores whose worker id matches the id in the req.
// req.query is used for get requests (other requests use req.body)
export async function getChoresByWorker(req, res) {
    console.log("controller get worker chores")
    console.log("req.query", req.query)
    try {
        const some = await Chore.find({ worker: req.query.id, isActive: true });
        console.log("some", some)
        res.status(200).json(some);
    } catch (error) {
        console.log("can't get workers chores");
        res.status(400).json(error);
    }
}

// query needs to be array of family ids to work
// The frontend sends: params: { parents } 
export async function getChoresByParents(req, res) {
    console.log("controller get creator chores")
    console.log("req.query", req.query["parents[]"])
    try {
        const some = await Chore.find({ creator: {$in: req.query["parents[]"]}, isActive: true }).populate('worker', "name _id")
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
            console.log("dueDate", req.body.dueDate)
            const dueDate = new Date(req.body.dueDate);
            const hours = dueDate.getHours();
            const minutes = dueDate.getMinutes();
            const today = new Date()
            today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            const tomorrow = today
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            console.log("tomorrow", tomorrow)
            const in2days = new Date(tomorrow)
            in2days.setDate(in2days.getDate() + 1);
            const in3days = new Date(in2days)
            in3days.setDate(in3days.getDate() + 1);
            const in4days = new Date(in3days)
            in4days.setDate(in4days.getDate() + 1);
            const in5days = new Date(in4days)
            in5days.setDate(in5days.getDate() + 1);
            const in6days = new Date(in5days)
            in6days.setDate(in6days.getDate() + 1);
            const in7days = new Date(in6days)
            in7days.setDate(in7days.getDate() + 1);

            const CHORE1 = await Chore.create({ ...req.body, dueDate: today, stage: "incomplete", isActive: true, })
            const CHORE2 = await Chore.create({ ...req.body, dueDate: tomorrow, stage: "incomplete", isActive: true, })
            const CHORE3 = await Chore.create({ ...req.body, dueDate: in2days, stage: "incomplete", isActive: true, })
            const CHORE4 = await Chore.create({ ...req.body, dueDate: in3days, stage: "incomplete", isActive: true, })
            const CHORE5 = await Chore.create({ ...req.body, dueDate: in4days, stage: "incomplete", isActive: true, })
            const CHORE6 = await Chore.create({ ...req.body, dueDate: in5days, stage: "incomplete", isActive: true, })
            const CHORE7 = await Chore.create({ ...req.body, dueDate: in6days, stage: "incomplete", isActive: true, })
            const Template = await ChoreTemplate.create({ ...req.body, isActive: true, })
            console.log(`running cron job. ${req.body.repeat}.`)
            res.status(201).json(CHORE1)
        }

        else if (req.body.repeat == "weekly") {
            console.log("day", req.body.day)
            const today = new Date();
            const todayDay = today.getDay();
            const target = req.body.day
            let diff = target - todayDay;

            const dueDate = new Date(req.body.dueDate);
            const hours = dueDate.getHours();
            const minutes = dueDate.getMinutes();
            // If targetDay is earlier in the week, wrap to next week
            if (diff < 0) {
                diff += 7;
            }
            let hourDue = dueDate.getHours()
            let currentHour = today.getHours()
            console.log("current", currentHour, "hourDue", hourDue, "diff", diff)
            //makes dueDay next week instead of today
            if (diff === 0 && currentHour > hourDue) {
                console.log("wrapping")
                diff = 7;}

            const newDueDate = new Date(today);
            newDueDate.setDate(today.getDate() + diff);
            newDueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            console.log("duedate", newDueDate.toLocaleDateString())

            const CHORE = await Chore.create({ ...req.body, dueDate: newDueDate, stage: "incomplete", isActive: true, })
            const Template = await ChoreTemplate.create({ ...req.body, isActive: true, })
            console.log("running cron job. Weekly.")
            res.status(201).json(CHORE)
        }
        else if (req.body.repeat == "monthly") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true, })
            const Template = await ChoreTemplate.create({ ...req.body, isActive: true, })
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
        const allowedUpdates = ['title', "details", 'stage', "worker", "dueDate", "stageDate", "beforePic",
            "afterPic", "isActive", "needsPics", "parentComments", "kidComments", "dateEdited"]; // Define what can be updated
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