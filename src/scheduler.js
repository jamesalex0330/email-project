import express from 'express';
import dotenv from 'dotenv';
import ScheduleBootstrap from './scheduleBootstarp';

dotenv.config();
const app = express();
const bootstrap = new ScheduleBootstrap(app);
