import mongoose from "mongoose"

// Define a schema for our User model
const familySchema = new mongoose.Schema({
    parents: {
        type: Array,
        required: [true, 'Must have parent array.'],
        minLength: [1, `Must have at least 1 parent.`],
        maxLength: [3, `Cannot exceed 3 parents.`]
    },
    children: {
        type: Array,
        required: [true, "Must have children array."]
    }
}, { timestamps: true });


const family = mongoose.model('family', familySchema);

export default family