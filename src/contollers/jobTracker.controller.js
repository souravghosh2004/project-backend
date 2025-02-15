import JobTracker from "../models/jobTraker.model.js";
import Student from "../models/student.model.js"

const selectRound = async (req, res) => {
    const { roundName, studentIds, jobTrackerId } = req.body;

    // Validate roundName
    const validRounds = [
        "resumeSelect",
        "firstRound",
        "secondRound",
        "thirdRound",
        "fourthRound",
        "finalRound",
    ];
    if (!validRounds.includes(roundName)) {
        return res.status(400).json({ message: "Invalid round name specified." });
    }

    try {
        // Retrieve the JobTracker document
        const jobTracker = await JobTracker.findById(jobTrackerId);
        if (!jobTracker) {
            return res.status(404).json({ message: "JobTracker not found" });
        }

        // Update the specified round with the selected IDs
        jobTracker[roundName] = studentIds;
        // Clear IDs from all subsequent rounds after the updated round
        const nextRoundIndex = validRounds.indexOf(roundName) + 1;
        for (let i = nextRoundIndex; i < validRounds.length; i++) {
            jobTracker[validRounds[i]] = [];
        }
        await jobTracker.save();

        if(jobTracker.resumeSelect.length == 0){
            jobTracker.resumeRoundCompleted = false;
        }else{
            jobTracker.resumeRoundCompleted = true;
        }
        if(jobTracker.firstRound.length == 0){
            jobTracker.firstRoundCompleted = false;
        }else{
            jobTracker.firstRoundCompleted = true;
        }
        if(jobTracker.secondRound.length == 0){
            jobTracker.secondRoundCompleted = false;
        }else{
            jobTracker.secondRoundCompleted = true;
        }
        if(jobTracker.thirdRound.length == 0){
            jobTracker.thirdRoundCompleted = false;
        }else{
            jobTracker.thirdRoundCompleted = true;
        }
        if(jobTracker.fourthRound.length == 0){
            jobTracker.fourthRoundCompleted = false;
        }else{
            jobTracker.fourthRoundCompleted = true;
        }

        if(roundName == "finalRound"){
            jobTracker.finalRoundCompleted = true;
        }
        // Save the updated JobTracker document
        await jobTracker.save();

        return res.status(200).json({
            message: `${roundName} updated successfully.`,
            updatedJobTracker: jobTracker,
        });
    } catch (error) {
        console.error("Error updating JobTracker:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const getJobTrackerDetails = async (req, res) => {
    const { jobTrackerId } = req.params;

    try {
        const jobTracker = await JobTracker.findById(jobTrackerId).populate("jobDetails").lean();

        if (!jobTracker) {
            return res.status(200).json({ message: `JobTracker not found id = ${jobTrackerId}` });
        }

        res.status(200).json(jobTracker);
    } catch (error) {
        console.error("Error fetching JobTracker details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const createJobTrackor = async (req, res) => {
    const { jobId, password, jobDetails } = req.body;
  
    try {
      const jobTracker = await JobTracker.findOne({ jobDetails });
      if (jobTracker) {
        return res.status(400).json({message: "Job tracker already exists."});
      }
  
      // Create and save new JobTracker
      const newJobTracker = new JobTracker({
        jobId,
        password,
        jobDetails
      });
  
      await newJobTracker.save();
  
      res.status(201).json({ message: 'Job Tracker added successfully!', data: newJobTracker });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving Job Tracker', error: error.message });
    }
  };
  
const logInJobTracker = async (req, res) => {
    const { jobId, password } = req.body;
    if(!password) return res.status(401).json({ message: "Password is required" });
    if(!jobId) return res.status(401).json({ message: "Job ID is required" });

    try{
        const response = await JobTracker.findOne({ jobId});
        if(!response) return res.status(400).json({ message: "Invalid Job ID" });
        if(response.password !== password) return res.status(400).json({ message: "Invalid Password"});
        res.status(201).json(response);

    }catch (error) {
        return res.status(500).json({ message: "Error logging in JobTracker", error: error.message})
    }
}

const trackOneStudent = async (req,res) => {
    const {studentCode} = req.body;

    try {
        const student = await Student.findOne({studentCode}).exec();
        if(!student){
            return res.status(300).json({message:"Student not found please enter correct student code"})
        }

        const appliedJobs = student.appliedJobs || [];
        const studentId = student._id;
       // res.status(200).json(appliedJobs);

        const jobTrack = await JobTracker.find({jobDetails : {$in : appliedJobs}}).populate("jobDetails");

        const result = jobTrack.map((job) => {
            const studentInRounds = {
                resumeSelect : job.resumeSelect.includes(studentId),
                resumeRoundCompleted : job.resumeRoundCompleted,
                firstRound : job.firstRound.includes(studentId),
                firstRoundCompleted : job.firstRoundCompleted,
                secondRound : job.secondRound.includes(studentId),
                secondRoundCompleted : job.secondRoundCompleted,
                thirdRound : job.thirdRound.includes(studentId),
                thirdRoundCompleted : job.thirdRoundCompleted,
                fourthRound : job.fourthRound.includes(studentId),
                fourthRoundCompleted : job.fourthRoundCompleted,
                finalRound : job.finalRound.includes(studentId),
                finalRoundCompleted : job.finalRoundCompleted
            }
            return {
                jobTrackerID : job._id,
                jobID:job.jobDetails._id,
                jobDetails : job.jobDetails,
                studentInRounds,

            }
        })

        res.status(200).json({result,student});

        } catch (error) {
            
        }

        



}

const trackOneJob = async (req, res) => {
    const { studentId, jobDetails } = req.body;

    // Validate input
    if (!studentId || !jobDetails) {
        return res.status(400).json({ message: "Please provide both studentId and jobDetails" });
    }

    try {
        // Check if job tracker exists
        const jobTrack = await JobTracker.findOne({ jobDetails });
        if (!jobTrack) {
            return res.status(404).json({ message: "Job tracker not available" });
        }

        // Prepare response data
        const studentInRounds = {
            resumeSelect: jobTrack.resumeSelect?.includes(studentId) || false,
            resumeRoundCompleted: jobTrack.resumeRoundCompleted || false,
            firstRound: jobTrack.firstRound?.includes(studentId) || false,
            firstRoundCompleted: jobTrack.firstRoundCompleted || false,
            secondRound: jobTrack.secondRound?.includes(studentId) || false,
            secondRoundCompleted: jobTrack.secondRoundCompleted || false,
            thirdRound: jobTrack.thirdRound?.includes(studentId) || false,
            thirdRoundCompleted: jobTrack.thirdRoundCompleted || false,
            fourthRound: jobTrack.fourthRound?.includes(studentId) || false,
            fourthRoundCompleted: jobTrack.fourthRoundCompleted || false,
            finalRound: jobTrack.finalRound?.includes(studentId) || false,
            finalRoundCompleted: jobTrack.finalRoundCompleted || false,
        };

        return res.status(200).json({ studentInRounds });
    } catch (error) {
        console.error("Error in trackOneJob:", error.message);

        // Handle specific errors if needed
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error occurred" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};


const trackJob = async (req, res) => {
    const { jobDetails } = req.body;
    // Validate input
    if (!jobDetails) {
        return res.status(400).json({ message: "Please provide jobDetails" });
    }
    try {
         const jobTrack = await JobTracker.findOne({ jobDetails })
            .populate('resumeSelect')
            .populate('firstRound')
            .populate('secondRound')
            .populate('thirdRound')
            .populate('fourthRound')
            .populate('finalRound');
         if (!jobTrack) {
            return res.status(404).json({ message: "Job tracker not available" });
         }
         return res.status(200).json({jobTrack});

    }catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const finalRoundSelectStudent = async (req, res) => {
    
    try {
        const jobTrackers = await JobTracker.find()
        .populate({
            path: 'finalRound',
            select: 'studentName studentStream profilePic'
        })
        .populate({
            path: "jobDetails",
            select: 'companyName jobRole salary'
        });
        const finalRoundStudents = jobTrackers
        .filter(jobTrack => jobTrack.finalRound.length > 0)
        .map(jobTrack => ({
            jobDetails : jobTrack.jobDetails,
            slecetedStudent : jobTrack.finalRound
        }))
        
        return res.status(200).json(finalRoundStudents);
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export{
    selectRound,
    getJobTrackerDetails,
    createJobTrackor,
    trackOneStudent,
    trackOneJob,
    trackJob,
    logInJobTracker,
    finalRoundSelectStudent
}
