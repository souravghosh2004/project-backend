import { Router } from "express";
const router = Router();
import { registerStudent,loginStudent,applyForJob,getAppliedJobs,
    getStudentDetails,updateProfilePic,studentForgotPassword} from "../contollers/student.controller.js";
import {createStudentFullProfile,getOneStudentFullProfile,updateStudentFullProfile} from '../contollers/studentFullProfile.controller.js'
//router.get('/login', (req,res) =>{
   // res.send("welcome to student login page");
//})
import {upload} from '../middleware/multer.middleware.js'

router.post('/register',registerStudent);
router.post('/login',loginStudent);
router.post('/store/student-applied-job',applyForJob);
router.post('/get/applied-jobs',getAppliedJobs);
router.post('/track/details',getStudentDetails);
router.post('/create/student-full-profile',createStudentFullProfile);
router.post('/get/one-student-full-profile',getOneStudentFullProfile);
router.route('/update/student-full-profile').post(
   upload.fields([
       { name: "cv", maxCount: 1 },
   ]),
   (req, res, next) => {
    
       next();
   },
   updateStudentFullProfile
);
router.route('/update/profile-pic').post(
    upload.fields([
        { name: "filePath", maxCount: 1 },
    ]),
    (req, res, next) => {
        next();
    },
    updateProfilePic
 );

 router.post('/forgot-password',studentForgotPassword);


export default router;