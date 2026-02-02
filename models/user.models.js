import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3, 'Username must be of 3 chars ']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [13, 'Email must be of 13 chars ']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 chars '] // <-- FIX: Increased to 8 to match security standard/route validation
    },
    address: {
        type: String,
        required: false, // <-- CRITICAL FIX: Made optional, as form doesn't send it
        trim: true,
        minlength: [5]
    },
    medication: {
        type: String,
        required: false, // Made optional
        minlength: [5]
    },
    allergies: {
        type : String,
        required: false // Made optional
    }
});

const user = mongoose.model('user', userSchema);

export default user;