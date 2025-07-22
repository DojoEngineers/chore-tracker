import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

// Define a schema for our User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minLength: [2, `Name must be at least 2 characters`],
        maxLength: [30, `Name cannot exceed 30 characters.`]
    },
    username: {
        type: String,
        required: [true, 'Email or Phone number is required.'],
        minLength: [7, `Invalid Email or Phone number.`],
        maxLength: [50, `Email/phone cannot exceed 50 characters.`]
    },
    // The hashed password (stored securely, not plain text)
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minLength: [8, `Passwords must be at least eight characters long!`],
        maxLength: [100, `Password cannot exceed 100 characters.`]
    },
    isParent: {
        type: Boolean,
        required: [true, "Account type required."]
    },
    children: {
        type: Array,
        required: [false]
    },
    parents:{
        type:Array,
        required:[false]
    },
    choresCompleted:
    {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        required: [true, "Please specify if account is verified"]
    },
    isActive: {
        type: Boolean,
        required: [true, "Please specify if account is active."]
    }

}, { timestamps: true });

// ------------------------------
// VIRTUAL FIELD: confirmPassword
// ------------------------------
// This field does NOT get stored in MongoDB.
// It's used for validating that the user typed the same password twice.

userSchema.virtual('confirmPassword')
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        // When confirmPassword is set (e.g., from a form), we store it on the instance
        this._confirmPassword = value;
    });

// ---------------------------------
// MIDDLEWARE: Validate Password Match
// ---------------------------------
// Before validation runs, check if password === confirmPassword
// Only necessary when password is being modified (e.g., on registration or password change)

//'validate' indicates that it is to run before validations
// next is a positional argument that is automatically provided by Mongoose when calling middleware functions.
// is a callback that tells Mongoose when to proceed to the next step in the middleware chain.
// If next() is never called, the operation (e.g., validation or saving) hangs indefinitely.
// If an error is passed to next(error), it stops execution and throws that error.
userSchema.pre('validate', function (next) {
    if (this.isModified('password') && this.password !== this.confirmPassword) {
        // This will cause validation to fail and return an error
        this.invalidate('confirmPassword', 'Passwords must match');
        // this.invalidate( fieldName, errorMessage )
        // The invalidate() method is used to manually trigger a validation error on a specific field in a Mongoose schema. This is useful when you want to enforce custom validation rules beyond built-in schema validation.
    }
    next();
});

// -----------------------------
// MIDDLEWARE: Hash Password Before Saving
// -----------------------------
// Only runs if the password field was changed (new user, or password update)

// pre save will only run if saving is actually going to take place.
userSchema.pre('save', async function (next) {
    // Skip if password hasn't changed
    // isModified is a built in method: Returns true if any of the given paths are modified, else false. If no arguments, returns true if any path in this document is modified.
    if (!this.isModified('password')) {
        return next();
    }
    // Generate a salt and hash the password
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        return next(error);  // Pass any errors to the next middleware
    }
    return next();
});

// -----------------------------
// METHOD: Compare Entered Password with Stored Hash
// -----------------------------
// Used when logging in: compare the plain password with the hashed one in the DB

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export it so other files (controllers, routes) can use it
export default User;

// Mongoose performs all validation first:

//     Runs built-in validators like required, minlength, etc.

//     Then it triggers your custom validators (like the confirmPassword match).

//     Only after all validations pass does it run the pre('save') hook to hash the password.