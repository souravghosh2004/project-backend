import { Router } from "express";
const router = Router();

import { getJobTrackerDetails,selectRound,finalRoundSelectStudent,
    createJobTrackor,trackOneStudent,trackOneJob,trackJob,logInJobTracker } from "../contollers/jobTracker.controller.js";

router.get('/one/:jobTrackerId',getJobTrackerDetails);
router.post("/select-student",selectRound);
router.post("/create-job-tracker",createJobTrackor);
router.post("/one-student-track",trackOneStudent);
router.post("/one-job-track",trackOneJob);
router.post("/job-track",trackJob);
router.post("/login-job-tracker",logInJobTracker);
router.get("/placed-student",finalRoundSelectStudent);

export default router;