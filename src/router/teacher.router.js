import { Router } from "express";
//import { registerStudent } from "../contollers/student.controller";
import { registerTeacher,loginTeacher } from "../contollers/teacher.controller.js";

const router = Router();

router.post('/register',registerTeacher);
router.post('/login',loginTeacher);

export default router;

