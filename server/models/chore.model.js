import mongoose from "mongoose"

// Define a schema for our Chore model
const choreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required.'],
        minLength: [3, `Title must be at least 3 characters.`],
        maxLength: [30, `Title cannot exceed 30 characters.`]
    },
    details: {
        type: String,
        required: false,
        maxLength: [100, `Details cannot exceed 100 characters.`]
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Error! No creator."],
        maxLength: [150, `Creator cannot exceed 150 characters.`]
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please assign chore to a worker."]
    },
    dueDate: {
        type: Date,
        required: [true, "Please assign a due date."],
    },
    day: {
        type:Number,
        required: false
    },
    dateEdited: {
        type: Date,
        required: false
    },
    stageDate: {
        type: Date,
        required: false
    },
    stage: {
        type: String,
        enum: ["incomplete", "complete", "approved", "rejectedUnassigned", "rejectedReassigned"],
        default: "incomplete",
        required: [true, "must have stage."]
    },
    repeat: {
        type: String,
        enum: ["never", "daily", "weekly", "monthly"],
        default: "never",
        required: [true, "must state if chore repeats"]
    },
    needsPics: {
        type: Boolean,
        default: false
    },
    beforePic: {
        type: String,
        required: false
    },
    afterPic: {
        type: String,
        required: false
    },
    parentComments: {
        type: String,
        required: false,
        maxLength: [100, `Comments cannot exceed 100 characters.`]
    },
    kidComments: {
        type: String,
        required: false,
        maxLength: [100, `Comments cannot exceed 100 characters.`]
    },
    templateId: {
        type: String,
        required:false
    },
    isActive: {
        type: Boolean,
        required: [true, "Please state if active"]
    }
}, { timestamps: true });

// Create the Chore model from the schema
const Chore = mongoose.model('Chore', choreSchema);

// Export it so other files (controllers, routes) can use it
export default Chore;