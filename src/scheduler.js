import express from 'express';
import dotenv from 'dotenv';
import ScheduleBootstrap from './scheduleBootstarp';

dotenv.config();
const app = express();
app.set('port', 7071);
const bootstrap = new ScheduleBootstrap(app);
