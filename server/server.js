const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Appointment = require('./models/Appointment');
const auth = require('./middleware/auth');
require('dotenv').config();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());




const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDb();





const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

const User = mongoose.model("User", userSchema);




app.post('/api/register', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Email and password are required"})
    }
    const existingUser = await User.findOne({ email })
    if(existingUser) {
        return res.status(409).json({success: false, message: "User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    return res.status(201).json({success: true, message: "User registered successfully"})
})

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Email and password are required"})
    }

    const user = await User.findOne({ email })
    if(!user) {
        return res.status(401).json({success: false, message: 'Email or password are incorrect, try again'})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({success: false, message: 'Email or password are incorrect, try again'})
    }

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({success: true, message: 'Login successful', token})
})

app.post('/api/appointments', auth, async ( req, res) => {
    try {
        const appointment = await Appointment.create({
            ...req.body,
            usrId: req.userId
        });

        res.status(201).json({ success: true, message: "Appointment created successfully", appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
})






app.listen(port, () => {
    console.log('Server is running on port 4000')
})
