import Chore from "../models/chore.model.js"
import ChoreTemplate from "../models/choreTemplate.js"
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday.js"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(weekday)
dayjs.extend(utc)
dayjs.extend(timezone)

export const seedDB = async (req, res) => {
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
        const del = await Chore.deleteMany({creator: req.body.id})
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
    try {
        const some = await Chore.find({ creator: {$in: req.query["parents[]"]}, isActive: true }).populate('worker', "name _id")
        res.status(200).json(some)
    } catch (error) {
        console.log("can't get creator chores")
        res.status(400).json(error)
    }
}

export const addChore = async (req, res) => {
    console.log("addChore controller. req.body:", req.body)
    try {
        const templateData = {
            title: req.body.title,
            details: req.body.details,
            creator: req.body.creator,
            dueDate: req.body.dueDate,
            needsPics: req.body.needsPics,
            repeat: req.body.repeat,
            weeklyRepeatDays: req.body.weeklyRepeatDays,
            worker: req.body.worker,
            isActive: true,
        }

        if (req.body.repeat == "never") {
            const CHORE = await Chore.create({ ...req.body, stage: "incomplete", isActive: true })
            res.status(201).json(CHORE)
        }
        else if (req.body.repeat == "daily") {
            const Template = await ChoreTemplate.create(templateData)
    
            const base = dayjs(req.body.dueDate)
            const chores = []
            
            for (let i = 0; i < 7; i++) {
                const dueDate = base.add(i, 'day')
                const CHORE = await Chore.create({
                    ...req.body,
                    dueDate: dueDate.toDate(),
                    stage: "incomplete",
                    isActive: true,
                    templateId: Template._id
                })
                chores.push(CHORE)
            }
            
            res.status(201).json(chores[0])
        }
        else if (req.body.repeat == "weekly") {
            const Template = await ChoreTemplate.create(templateData)

            const base = dayjs(req.body.dueDate)
            const weeklyDays = req.body.weeklyRepeatDays || []
            const createdChores = []

            for (const targetDay of weeklyDays) {
                let due = base.weekday(targetDay)

                if (due.isBefore(base, "minute")) {
                    due = due.add(1, "week")
                }

                const CHORE = await Chore.create({
                    ...req.body,
                    dueDate: due.toDate(),
                    stage: "incomplete",
                    isActive: true,
                    templateId: Template._id
                })

                createdChores.push(CHORE)
            }
            
            res.status(201).json(createdChores)
        }
        else if (req.body.repeat == "monthly") {
            const Template = await ChoreTemplate.create(templateData)
            const CHORE = await Chore.create({ 
                ...req.body, 
                stage: "incomplete", 
                isActive: true, 
                templateId: Template._id
            })
            
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
        const allowedUpdates = ['title', "details", 'stage', "worker", "dueDate", "stageDate", "beforePic", "afterPic",
            "isActive", "needsPics", "parentComments", "kidComments", "dateEdited", "weeklyRepeatDays", "templateId", "repeat"] // Define what can be updated
        const updateData = {}
        // Only include allowed fields that exist in req.body
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field]
            }
        })
        const CHORE = await Chore.findByIdAndUpdate(req.body._id, { $set: updateData }, { new: true }).select('-password')

        if (req.body.editScope === 'repeating') {
            const templateFields = ['title', 'details', 'needsPics', 'repeat', 'weeklyRepeatDays', 'dueDate', 'worker']
            const templateData = {}
            
            templateFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    templateData[field] = req.body[field]
                }
            })

            if (req.body.templateId) {
                await ChoreTemplate.findByIdAndUpdate(
                    req.body.templateId, 
                    { $set: templateData }, 
                    { new: true }
                )
            } else {
                const template = await ChoreTemplate.create({
                    ...templateData,
                    creator: req.body.creator,
                    isActive: true
                })
                CHORE.templateId = template._id
                await CHORE.save()
            }
        }

        res.status(201).json(CHORE)

    } catch (error) {
        console.log("edit Chore controller error", error)
        res.status(400).json(error)
    }
}