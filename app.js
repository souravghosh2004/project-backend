import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express()

app.use(cors({ origin: 'https://tranquil-phoenix-e279d9.netlify.app/' })); 
app.use(express.json());
app.use(bodyParser.json());

import jobRouter from './src/router/job.router.js';
import studentRouter from './src/router/student.router.js';
import teacherRouter from './src/router/teacher.router.js';
import jobTrackerRouter from './src/router/jobTrackor.router.js';
import mailRouter from './src/router/mail.router.js';

app.use('/api/student',studentRouter);
app.use('/api/job',jobRouter);
app.use('/api/teacher',teacherRouter);
app.use('/api/track/job',jobTrackerRouter);
app.use('/api/mail',mailRouter);


export default app;
