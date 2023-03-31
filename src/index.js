import express from 'express';
import dotenv from 'dotenv';
import Bootstrap from './bootstrap';

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 7070);
const bootstrap = new Bootstrap(app);
