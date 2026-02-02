import express from 'express';
import { body, validationResult } from 'express-validator';
import userModel from '../models/user.models.js'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
// IMPORTANT: You need to have process.env.JWT_SECRET defined, usually in a .env file loaded by 'dotenv'.

const router = express.Router();

// --- GET Routes (For rendering views/pages) ---

router.get('/registerpatient' ,(req ,res) =>{
    // Assumes you are using a templating engine (like EJS, Handlebars, etc.)
    res.render('patientregistration'); 
});

router.get('/login', (req , res) =>{
    res.render('login');
});

// --- POST Route for Patient Registration (Creation) ---

router.post('/registerpatient',
    body('email').trim().isEmail().isLength({min:13}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:5}),
    async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message: "Invalid data"
        });
    }
   const {email , username , password} = req.body;

   // CORRECT: Hash the password and then save the hashed version
   const hashpassword = await bcrypt.hash(password , 10);
   const newuser = await userModel.create({
        email,
        username,
        password: hashpassword 
   });
   res.json(newuser);
});

// --- POST Route for User Login (Authentication) ---

router.post('/login',
    // Validation checks
    body('email').trim().isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    
    async (req, res) => {
         const errors = validationResult(req);
        if(!errors.isEmpty()){
             return res.status(400).json({
                errors: errors.array(),
                message: "Invalid login data provided."
        });
        }

        try {
            const { email, password } = req.body;
            
            // 1. Find user by email
            const user = await userModel.findOne({ email });

            if (!user) {
                // It's best practice to give a generic failure message
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // 2. Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // 3. Generate JWT token
            const token = jwt.sign({
                userId: user._id,
                email: user.email,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Add expiration time

            // 4. Set token in HTTP-only cookie and send response
            res.cookie('token' , token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            
            res.send ('Logged in successfully');

        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal server error during login." });
        }
    }
);

export default router;