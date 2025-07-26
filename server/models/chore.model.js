import mongoose from "mongoose"

// Define a schema for our Chore model
const choreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required.'],
        minLength: [5, `Description must be at least 5 characters.`],
        maxLength: [30, `Description cannot exceed 30 characters.`]
    },
    details: {
        type: String,
        required: [true, 'Details required.'],
        minLength: [5, `Details must be at least 5 characters.`],
        maxLength: [250, `Details cannot exceed 250 characters.`]
    },
    creator: {
        type: String,
        required: [true, "Error! No creator."],
        maxLength: [150, `Creator cannot exceed 150 characters.`]
    },
    worker: {
        type: String,
        required: [true, "Please assign chore to a worker."]
    },
    dueDate: {
        type: Date,
        required: [true, "Please assign a due date."],
    },
    dateCompleted: {
        type: Date,
        required: [false]
    },
    stage: {
        type: String,
        enum: ["incomplete", "complete", "approved", "rejected" ],
        default: "incomplete",
        required: [true]
    },
    needsPics: {
        type: Boolean,
        default: false,
        required: [true]
    },
    beforePic: {
        type: String,
        required: [false]
    },
    afterPic: {
        type: String,
        required: [false]
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