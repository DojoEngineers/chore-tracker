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
    try {
        const {
            title,
            details,
            creator,
            dueDate,
            needsPics,
            repeat,
            weeklyRepeatDays,
            worker,
            timezone
        } = req.body

        const base = dayjs(dueDate).tz(timezone || 'UTC')
        const dueHour = base.hour()
        const dueMinute = base.minute()

        // If not repeating just create chore
        if (repeat === "never") {
            const chore = await Chore.create({
                ...req.body,
                stage: "incomplete",
                isActive: true
            })

            return res.status(201).json(chore)
        }

        // Create FIRST chore occurrence
        const firstChore = await Chore.create({
            ...req.body,
            dueDate: base.toDate(),
            stage: "incomplete",
            isActive: true
        });

        // Compute nextRunDate
        let nextRunDate

        if (repeat === "daily") {
            nextRunDate = base.add(1, "day")
        }

        else if (repeat === "weekly") {
            const sortedDays = [...(weeklyRepeatDays || [])].sort((a, b) => a - b)
            const currentDay = base.day()
            let nextDay = sortedDays.find(d => d > currentDay)
            if (nextDay === undefined) {
                nextDay = sortedDays[0]
                const daysToAdd = (nextDay + 7) - currentDay
                nextRunDate = base.add(daysToAdd, 'day')
            } else {
                const daysToAdd = nextDay - currentDay
                nextRunDate = base.add(daysToAdd, 'day')
            }
        }

        else if (repeat === "monthly") {
            nextRunDate = base.add(1, "month")
        }

        nextRunDate = nextRunDate.startOf('day')

        // Create template with nextRunDate
        const template = await ChoreTemplate.create({
            title,
            details,
            creator,
            worker,
            needsPics,
            repeat,
            weeklyRepeatDays,
            isActive: true,
            nextRunDate: nextRunDate.toDate(),
            timezone: timezone || 'UTC',
            dueHour,
            dueMinute
        })

        // 🔹 Attach templateId to first chore
        firstChore.templateId = template._id
        await firstChore.save()

        res.status(201).json(firstChore)

    } catch (error) {
        console.log("addChore controller error", error)
        res.status(400).json(error)
    }
}


// for adding chore pics, changing details, marking as complete, "deleting" by setting to inactive etc.
export const updateChore = async (req, res) => {
    console.log("edit Chore controller. req.body:", req.body)

    try {
        // Update single chore fields
        const allowedChoreUpdates = [
            "title",
            "details",
            "stage",
            "worker",
            "dueDate",
            "stageDate",
            "beforePic",
            "afterPic",
            "isActive",
            "needsPics",
            "parentComments",
            "kidComments",
            "dateEdited"
        ]

        const updateData = {}
        allowedChoreUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field]
            }
        })

        const CHORE = await Chore.findByIdAndUpdate(
            req.body._id,
            { $set: updateData },
            { new: true }
        )

        // --- 2️⃣ Update repeating template if requested ---
        if (req.body.editScope === "repeating") {
            const templateFields = [
                "title",
                "details",
                "needsPics",
                "repeat",
                "weeklyRepeatDays",
                "worker"
            ]

            const templateData = {}
            templateFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    templateData[field] = req.body[field]
                }
            })

             // Parse dueDate into hour/minute
            if (req.body.dueDate) {
                const base = dayjs(req.body.dueDate).tz(req.body.timezone || 'UTC')
                templateData.dueHour = base.hour()
                templateData.dueMinute = base.minute()
                templateData.timezone = req.body.timezone
            }

            if (req.body.templateId) {
                // Update existing template
                await ChoreTemplate.findByIdAndUpdate(
                    req.body.templateId,
                    { $set: templateData },
                    { new: true }
                )
            } else {
                // Create new template for this chore
                const base = dayjs(req.body.dueDate)
                const dueHour = base.hour()
                const dueMinute = base.minute()
                let nextRunDate

                if (req.body.repeat === "daily") {
                    nextRunDate = base.add(1, "day")
                }
                else if (req.body.repeat === "weekly") {
                    const sortedDays = [...(req.body.weeklyRepeatDays || [])].sort((a, b) => a - b)
                    const currentDay = base.day()
                    let nextDay = sortedDays.find(d => d > currentDay)
                    if (nextDay === undefined) {
                        nextDay = sortedDays[0]
                        const daysToAdd = (nextDay + 7) - currentDay
                        nextRunDate = base.add(daysToAdd, 'day')
                    } else {
                        const daysToAdd = nextDay - currentDay
                        nextRunDate = base.add(daysToAdd, 'day')
                    }
                }
                else if (req.body.repeat === "monthly") {
                    nextRunDate = base.add(1, "month")
                }
                else {
                    nextRunDate = base
                }

                nextRunDate = nextRunDate.startOf('day')

                const template = await ChoreTemplate.create({
                    ...templateData,
                    creator: req.body.creator,
                    isActive: true,
                    nextRunDate: nextRunDate.toDate(),
                    dueHour,
                    dueMinute
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