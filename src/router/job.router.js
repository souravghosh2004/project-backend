import { Router } from "express";
const router = Router();
import { createJob,getAllJobs,getJobById,teacherOwnJob,deleteAJob,studentOwnJob,appliedStudentList } from "../contollers/job.controller.js";


router.post('/create',createJob);
router.get('/alljobs',getAllJobs);
router.get('/onejob/:id',getJobById);
router.get('/teacher-own-job/:id',teacherOwnJob);
router.delete('/delete-a-job/:id',deleteAJob);
router.post('/student-own-job',studentOwnJob);
router.get('/applied-student-list/:jobId',appliedStudentList);


export default router;