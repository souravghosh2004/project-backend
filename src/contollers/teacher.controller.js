import bcrypt from 'bcrypt'; // Ensure bcrypt is imported
import Teacher from '../models/teacher.model.js';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

    

const registerTeacher = async (req, res) => {
    const { teacherName, teacherMail, teacherDepatment, teacherPassword } = req.body;

    // Input Validation
    if (!teacherName || teacherName.trim() === '') {
        return res.status(400).json({ message: 'Teacher name is required' });
    }
    if (!teacherMail || teacherMail.trim() === '') {
        return res.status(400).json({ message: 'Teacher email is required' });
    }
    if (!teacherDepatment || teacherDepatment.trim() === '') {
        return res.status(400).json({ message: 'Teacher department is required' });
    }
    if (!teacherPassword || teacherPassword.trim() === '') {
        return res.status(400).json({ message: 'Teacher password is required' });
    }

    try {
        // Check if the teacher already exists
        const existingTeacher = await Teacher.findOne({ teacherMail });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(teacherPassword, 10);

        // Create new teacher
        const newTeacher = new Teacher({
            teacherName,
            teacherMail,
            teacherDepatment,
            teacherPassword: hashedPassword,
        });

        // Save the teacher to the database
        await newTeacher.save();

        // Respond with success
        res.status(201).json({ 
            message: 'Teacher registered successfully', 
            teacher: {
                id: newTeacher._id,
                name: newTeacher.teacherName,
                email: newTeacher.teacherMail,
                department: newTeacher.teacherDepatment
            }
        });
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ error: 'An error occurred while registering the teacher', details: error.message });
    }
};

const loginTeacher = async (req, res) => {
    const { teacherMail, teacherPassword } = req.body;
    if(teacherMail == ''){
        return res.status(400).json({ message: 'Teacher email is required' });
    }
    if(teacherPassword == ''){
        return res.status(400).json({ message: 'Teacher password is required' });
    }
    try {
        // Find the teacher by email
        const teacher = await Teacher.findOne({ teacherMail });
        if (!teacher) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Compare the provided password with the hashed password
        const isValiedPassword = await bcrypt.compare(teacherPassword,teacher.teacherPassword);
        if (!isValiedPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

         const role = teacher.role || 'teacher';

         const token = jwt.sign(
            { 
                id: teacher._id,
                teacherName:teacher.teacherName,
                role: role,
                teacherDepatment:teacher.teacherDepatment
            },
             process.env.SECRET_KEY,
             { expiresIn: '1h' }
            );
        res.status(200).json({
            message: 'Login successful!',
            token,
            teacherName: teacher.teacherName, // You can include other user details if necessary
            role: role,
        });

    }catch(error){
        res.status(500).json({ error: 'Internal server error!' });
        console.log(error);
    }
};

export { registerTeacher,loginTeacher };
