import mongoose from "mongoose"

// Define a schema for our User model
const familySchema = new mongoose.Schema({
    parents: {
        // must use this type for array of ids
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // type: Array,
        // required: [true, 'Must have parent array.'],
        // minLength: [1, `Must have at least 1 parent.`],
        // maxLength: [3, `Cannot exceed 3 parents.`]
    },
    children: {
        // type: Array,
        // required: [true, "Must have children array."]
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// validation is added seperately.
familySchema.path('parents').validate(function(value) {
    return value.length >= 1 && value.length <= 3;
}, 'Must have 1-3 parents');


const Family = mongoose.model('Family', familySchema);

export default Family