import { trusted } from "mongoose";
import Student from "../models/student.model.js";
import Job from "../models/job.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary,deleteFileFromCloudinary } from "../cloudinary/cloudinary.js";
import StudentFullProfile from "../models/studentFullProfile.model.js";
import fs from 'fs'
import dotenv from "dotenv";
dotenv.config();

const updateProfilePic = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    if (!req.files?.filePath) {
      return res.status(400).json({ message: "Profile picture file is required" });
    }

    const profilePicLocalPath = req.files.filePath[0].path;
    
    // Fetch the student to check if a profile picture already exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If a profilePic already exists, delete it from Cloudinary
    if (student.profilePic) {
      const publicId = student.profilePic.split('/').pop().split('.')[0];  // Extract public_id from the URL
      const deleteResult = await deleteFileFromCloudinary(publicId);
      if (deleteResult.status !== 200) {
        return res.status(deleteResult.status).json({ message: deleteResult.message });
      }
    }

    // Upload the new profile picture to Cloudinary
    const uploadProfilePic = await uploadOnCloudinary(profilePicLocalPath);
    const profilePic = uploadProfilePic.url;

    // Delete the local profile picture file after upload
    fs.unlinkSync(profilePicLocalPath);

    // Update the student's profile picture in the database
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { profilePic },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Profile picture updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


const registerStudent = async(req,res) => {
    const {studentName,password,studentCode,contactNumber, studentMail,studentStream} = req.body;
    if(password == ''){
        return res.status(400).json({message: 'Password is required'})
    }
    if(studentName == ''){
        return res.status(400).json({message: "Student name is required"});
    }
    if(studentCode == ''){
        return res.status(400).json({message: "Student code is required"});
    }
    if(studentMail == ''){
        return res.status(400).json({message: "Student mail is required"});
    }
    if(studentStream == ''){
        return res.status(400).json({message: "Student stream is required"});
    }
    try {
      const user = await Student.findOne({ studentMail });
      if(user){
        return res.status(400).json({message: "This male already register..."});
      }
    } catch (error) {
      return res.status(400).json({error: error.message})
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);      
        const student = await Student.create({studentName,password:hashedPassword,studentCode,contactNumber,
             studentMail,studentStream});
        if(student){
          
            const readyStudentFullProfile = new StudentFullProfile(
              {studentDetails:student._id},
              
            );
            await readyStudentFullProfile.save();
        }
        
        res.status(201).json(student);
    } catch (error) {
        return res.status(400).json({error: error.message})
    }

}


const loginStudent = async (req, res) => {
  const { studentMail, studentPassword } = req.body;

  try {
    const user = await Student.findOne({ studentMail });
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    const isPasswordValid = await bcrypt.compare(studentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password!' });
    }

    // Get the role from the user data (assuming it's stored in the DB)
    const role = user.role || 'student'; // Default to 'student' if no role is assigned in the DB

    // Create the JWT with role
    const token = jwt.sign(
      { 
        id: user._id, 
        studentName: user.studentName, 
        role: role, 
        studentCode: user.studentCode, 
        studentStream: user.studentStream 
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      studentName: user.studentName, // You can include other user details if necessary
      role: role,
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error!' });
    console.log(error);
  }
};

const studentForgotPassword = async (req, res) => {
  const { studentMail, confirmPassword, newPassword } = req.body;

  if (!studentMail) {
    return res.status(400).json({ message: 'Please provide your email address.' });
  }
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Please provide and confirm your new password.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const user = await Student.findOne({ studentMail });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Error resetting password:', error); // Log the error
    res.status(500).json({ message: 'Internal server error!' });
  }
};




// const loginStudent = async (req, res) => {
//     const { studentMail, studentPassword } = req.body;
//     if(studentMail == ''){
//         return res.status(400).json({message: "Student mail is required"});
//     }
//     if(studentPassword == ''){
//         return res.status(400).json({message: "Student password is required"});
//     }
//     console.log("mail = ",studentMail);
//     console.log("password = ",studentPassword);
  
//     try {
//       // Find the user by email
//       const user = await Student.findOne({ studentMail });
//       if (!user) {
//         return res.status(404).json({ error: 'User not found!' });
//       }
  
//       // Log to check if user.password is correctly fetched
//       console.log('Hashed password from DB:', user.password);
//       console.log('Password from request:', studentPassword);
  
//       // Check if passwords match
//       const isPasswordValid = await bcrypt.compare(studentPassword, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid password!' });
//       }
  
//       // Include user data in the payload and sign the token
//       const role = 'student';
//       const token = jwt.sign(
//         { id: user._id, studentName: user.studentName,role:role, studentCode: user.studentCode, studentStream: user.studentStream },
//         process.env.SECRET_KEY,
//         { expiresIn: '1h' }
//       );
  
//       res.status(200).json({ message: 'Login successful!', token });
//     } catch (error) {
//       console.error(error);  // Log the error for debugging
//       res.status(500).json({ error: 'Internal server error!' });
//     }
//   };
  
// Login route in the backend

/*const { username, password } = req.body;
  
try {
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password!' });
  }

  // Include user data in the payload
  const token = jwt.sign(
    { id: user._id, username: user.username, name: user.name },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.status(200).json({ message: 'Login successful!', token });
} catch (error) {
  res.status(500).json({ error: 'Internal server error!' });
}
*/ 

// const pushAppliedJob = async (req, res) => {
//   try {
//       const { jobId, studentId } = req.body;

//       // Validate request body
//       if (!jobId || !studentId) {
//           return res.status(400).json({ error: "jobId and studentId are required." });
//       }

//       // Find the student
//       const student = await Student.findById(studentId);
//       if (!student) {
//           return res.status(404).json({ error: "Student not found." });
//       }

//       // Check if the jobId already exists in appliedJobs
//       if (student.appliedJobs.includes(jobId)) {
//           return res.status(400).json({ error: "Job already applied." });
//       }

//       // Push the jobId to appliedJobs array
//       student.appliedJobs.push(jobId);

//       // Save the updated student document
//       await student.save();

//       res.status(200).json({ message: "Job applied successfully." });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error." });
//   }
// };


const applyForJob = async (req, res) => {
    try {
        const { jobId, studentId } = req.body;

        // Validate input
        if (!jobId || !studentId) {
            return res.status(400).json({ error: "jobId and studentId are required." });
        }

        // Find the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }

        // Check if the student has already applied for this job
        if (job.appliedStudent.includes(studentId)) {
            return res.status(400).json({ error: "Student has already applied for this job." });
        }

        // Add the student to the job's `studentsApplied` array
        job.appliedStudent.push(studentId);
        await job.save();

        // Optional: Add the job to the student's `appliedJobs` array
        if (!student.appliedJobs.includes(jobId)) {
            student.appliedJobs.push(jobId);
            await student.save();
        }

        res.status(200).json({ message: "Application submitted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const getAppliedJobs = async (req, res) => {
  try {
      const { studentId } = req.body;

      // Validate request parameter
      if (!studentId) {
          return res.status(400).json({ error: "Student ID is required." });
      }

      // Find the student and populate the appliedJobs field
      const student = await Student.findById(studentId).populate('appliedJobs');

      if (!student) {
          return res.status(404).json({ error: "Student not found." });
      }

      // Return the list of applied jobs
      res.status(200).json({
          studentName: student.studentName,
          studentMail: student.studentMail,
          appliedJobs: student.appliedJobs,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
};

const getStudentDetails = async (req, res) => {
  const { studentIds } = req.body;

  try {
      const students = await Student.find({ '_id': { $in: studentIds } });
      res.json(students);
  } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ message: "Server error" });
  }
};


export {registerStudent,loginStudent,applyForJob,
  getAppliedJobs,getStudentDetails,updateProfilePic,
  studentForgotPassword
};