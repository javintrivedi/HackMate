import express from 'express';
import dotenv from 'dotenv';

import './Modules/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';

import AuthRouter from './Routes/AuthRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;


dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());

app.use('/auth', AuthRouter);

app.get('/', (req, res) => {
  res.send('Hello from Auth Backend!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});