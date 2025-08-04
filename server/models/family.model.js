import mongoose from "mongoose"

// Define a schema for our User model
const familySchema = new mongoose.Schema({
    parents: [{
        // must use this type for array of ids
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// validation is added seperately.
familySchema.path('parents').validate(function(value) {
    return value.length >= 1 && value.length <= 3;
}, 'Must have 1-3 parents');


const Family = mongoose.model('Family', familySchema);

export default Family