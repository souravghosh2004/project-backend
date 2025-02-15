import Job from "../models/job.model.js";
import mongoose from "mongoose";
const createJob = async (req, res) => {
    const {companyName,location,jobRole,skills,eligibility,salary,description,applyLink,creator} = req.body;
    if(companyName === ""){
        return res.status(400).json({message: "Company name is required"});
    }
    if(jobRole === ""){
        return res.status(400).json({message: "Job role is required"});
    }
    if(eligibility == ""){
      return res.status(400).json({message: "Eligibility is required"});
    }
    if(location == ""){
      return res.status(400).json({message: "Location is required"});
    }
    if(salary == ""){
      return res.status(400).json({message: "Salary is required"});
    }
    if(skills == ''){
      return res.status(400).json({message: "Skills are required"});
    }
    if(applyLink == ""){
      return res.status(400).json({message: "Apply link is required"});
    }
    if(description == ""){
      return res.status(400).json({message: "Description is required"});
    }
    

    try {
        const newJob = await Job.create({companyName,location,jobRole,eligibility,skills,creator,
            salary,description,applyLink})
            res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}


const getAllJobs = async (req, res) => {
    try {
        const allJobs = await Job.find({}).sort({createdAt : -1})
        res.status(200).json(allJobs);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
  
}

const getJobById = async (req, res) => {
    const { id } = req.params; // Extract ID from route parameters
    try {
      const oneJob = await Job.findById(id); // Fetch job by ID
      if (!oneJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json(oneJob); // Return the found job
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};



const teacherOwnJob = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Query the database to fetch jobs associated with the id
      const jobs = await Job.find({ creator: id }).sort({createdAt : -1});
  
      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ message: 'No jobs found for the specified creator.' });
      }
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteAJob = async (req, res) => {
    const { id } = req.params;
    try {
      const job = await Job.findByIdAndDelete(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const studentOwnJob = async (req, res) => {
    const { eligibility } = req.body;
  
    if (!eligibility) {
      return res.status(400).json({ message: "Eligibility criteria is required." });
    }
  
    try {
      // Query to find jobs matching eligibility criteria
      const jobs = await Job.find({ eligibility: { $in: [eligibility] } }).sort({createdAt : -1});
  
      if (jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found for the provided eligibility criteria." });
      }
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "An error occurred while fetching jobs. Please try again later." });
    }
  };
  
  const appliedStudentList  = async (req,res) => {
    const {jobId} = req.params;

    if(!jobId){
      return res.status(400).json({message: "Job ID is required."});
    }
     
    try {
      const student = await Job.findById(jobId).populate({
        path: 'appliedStudent',
        select: "studentCode studentName studentStream contactNumber"
      })
      .exec();

      if(!student){
        console.log(student);
        return res.status(500).json({message: "student not found"});
      }

      res.status(201).json(student);
    } catch (error) {
      return res.status(500).json({message: "Internel server error"});
    }

  }



// const getJobById = async (req, res) => {
//      const {id} = req.params.id;
//      try {
//         const oneJob = await Job.findById(id);
//         if(!oneJob){
//             return res.status(404).json({message: "Job not found"});

//         }
//         res.status(201).json(oneJob);
//      } catch (error) {
//         res.status(500).json({message:"Job not fonund please try letter"});
//      }
// }
/*
     const workouts = await Workout.find({}).sort({createdAt : -1})
   res.status(200).json(workouts);
*/

export {
    createJob,
    getAllJobs,
    getJobById,
    teacherOwnJob,
    deleteAJob, 
    studentOwnJob,
    appliedStudentList
}