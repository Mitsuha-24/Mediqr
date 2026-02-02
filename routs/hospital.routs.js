import express from 'express';
import { body, validationResult } from 'express-validator';
import Hospital from '../models/hospital.models.js'; // Ensure this path is correct
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Needed for creating the JWT

// --- ES MODULE FIX: Define __dirname ---
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ----------------------------------------

const uploadDir = path.join(__dirname, '..', 'uploads', 'licenses');

// 1. Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const hospitalrouter = express.Router();

// 2. Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// ----------------------------------------------------
// GET Route for Hospital Registration Page 
// ----------------------------------------------------
hospitalrouter.get('/register', (req, res) => {
    res.render('hospitalregistration');
});


// ----------------------------------------------------
// POST Route for Hospital Registration
// ----------------------------------------------------
hospitalrouter.post('/register',
    upload.single('hospitalLicense'), 

    // Validation chain 
    body('hospitalName').trim().isLength({ min: 5 }).withMessage('Hospital name must be at least 5 characters.'),
    body('email').isEmail().withMessage('Must be a valid email address.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    body('streetAddress').isLength({ min: 5 }).withMessage('Street address must be at least 5 characters.'),
    body('cityStateZip').isLength({ min: 5 }).withMessage('City, State, ZIP must be at least 5 characters.'),
    body('doctorVerification').isIn(['email', 'upload']).withMessage('Invalid doctor verification method selected.'),

    async (req, res) => {
        const errors = validationResult(req);
        
        // --- Handle Validation Errors (and delete uploaded file) ---
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data submitted."
            });
        }
        
        // --- Handle Logic and Database Save ---
        try {
            const { hospitalName, email, password, streetAddress, cityStateZip, doctorVerification } = req.body;
            
            // 1. Check for missing file ONLY IF verification is 'upload'
            if (doctorVerification === 'upload' && !req.file) {
                 return res.status(400).json({ message: "Hospital License file is required for the 'Upload License' method." });
            }
            
            // 2. Hash the password
            const hashpassword = await bcrypt.hash(password, 10);
            
            // 3. Prepare license path
            let hospitalLicensePath = null;
            if (req.file) {
                hospitalLicensePath = req.file.path; 
            }

            // 4. Create the new hospital record
            const newHospital = await Hospital.create({
                hospitalName,
                email,
                password: hashpassword,
                address: { // Mongoose nested object mapping
                    streetAddress,
                    cityStateZip,
                },
                doctorVerification,
                hospitalLicense: hospitalLicensePath
            });

            // 5. Success Response
            res.status(201).json({
                message: "Hospital registered successfully!",
                hospitalId: newHospital._id
            });

        } catch (error) {
            // --- Handle Database/Server Errors (and delete uploaded file) ---
            console.error("Database Save Error:", error); 
            
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            if (error.code === 11000) {
                 res.status(409).json({ message: "Registration failed: Email or Hospital Name already exists." });
            } else {
                 res.status(500).json({
                    message: "A server error occurred during registration. Please check server console.",
                    error: error.message
                });
            }
        }
    }
);

hospitalrouter.get('/login', (req , res) =>{
    res.render('login');
});

hospitalrouter.post('/login',
    body ('email').trim().isEmail().isLength({min:3}),
    body ('password').trim().isLength({min:5}),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                error: errors.array(),
                message: "Invalid data"
            });
        }

        const { email, password } = req.body;
        const user = await Hospital.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'username is incorrect' });
        }

       // CORRECT: Use bcrypt.compare()
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'password is incorrect' });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET);
            res.json({ token });
    }
);

export default hospitalrouter;