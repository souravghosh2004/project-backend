import StudentFullProfile from '../models/studentFullProfile.model.js';
import { uploadOnCloudinary } from '../cloudinary/cloudinary.js';
import mongoose from 'mongoose';
import fs from 'fs';
const createStudentFullProfile = async (req,res) => {
    try {
        const {studentDetails} = req.body;
        const readyStudentFullProfile = new StudentFullProfile({studentDetails});
        readyStudentFullProfile.tenth.obtainedMarks = "500";
        await readyStudentFullProfile.save();
        return res.status(201).json({message: "Student Full Profile Created Successfully",data:{readyStudentFullProfile}});
    } catch (error) {
        return res.status(500).json({message: "Error Creating Student Full Profile",error})
    }
}

const getOneStudentFullProfile = async (req,res) => {
     try {
        const {studentDetails} = req.body;
        const studentFullProfile = await StudentFullProfile.findOne({studentDetails}).populate("studentDetails");
        if(!studentFullProfile) {
            return res.status(404).json({message: "Student Full Profile Not Found"})
        }
        return res.status(200).json(studentFullProfile);
     }catch (error){
        return res.status(500).json({message: "Error Getting Student Full Profile",error})
     }
}



const updateStudentFullProfile = async (req, res) => {
  try {
    // Check if the request body is empty
    if (!req.body) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const { studentDetails, tenth, twelfth, graduation, postGraduation } = req.body;

    // Validate required fields
    if (!studentDetails) {
      return res.status(400).json({ message: "Student details are required" });
    }

    // Safely parse fields only if they are valid JSON strings
    const parseField = (field, fieldName) => {
      if (!field) return null; // Skip parsing for null, undefined, or empty values
      try {
        return JSON.parse(field);
      } catch (error) {
        console.error(`Error parsing field '${fieldName}':`, error);
        throw new Error(`Invalid JSON for field: ${fieldName}`);
      }
    };

    const parsedTenth = parseField(tenth, "tenth");
    const parsedTwelfth = parseField(twelfth, "twelfth");
    const parsedGraduation = parseField(graduation, "graduation");
    const parsedPostGraduation = parseField(postGraduation, "postGraduation");

    // Handle CV upload if it exists
    let cvUrl = null;
    if (req.files?.cv) {
      const cvLocalPath = req.files.cv[0].path;
      const uploadedCV = await uploadOnCloudinary(cvLocalPath);
      cvUrl = uploadedCV?.url;

      // Clean up local file after upload (optional)
       fs.unlinkSync(cvLocalPath);
    }

    // Prepare the update payload dynamically
    const updatePayload = {
      ...(parsedTenth && { tenth: parsedTenth }),
      ...(parsedTwelfth && { twelfth: parsedTwelfth }),
      ...(parsedGraduation && { graduation: parsedGraduation }),
      ...(parsedPostGraduation && { postGraduation: parsedPostGraduation }),
      ...(cvUrl && { cv: cvUrl }),
    };


    // Update the student's profile in the database
    const updatedStudent = await StudentFullProfile.findOneAndUpdate(
      { studentDetails },
      { $set: updatePayload },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      message: "Student profile updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};




  



export{
     createStudentFullProfile,
    getOneStudentFullProfile,
    updateStudentFullProfile
    };