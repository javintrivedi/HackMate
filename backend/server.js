import express from 'express';
import dotenv from 'dotenv';

import './Modules/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';

import AuthRouter from './Routes/AuthRouter.js';
import ProfileRouter from './Routes/ProfileRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;


dotenv.config();

app.use(cors({
  origin: 'https://hack-mate-ten.vercel.app',
  credentials: true
}));

app.use(bodyParser.json());

app.use('/auth', AuthRouter);
app.use('/profile', ProfileRouter);

app.get('/', (req, res) => {
  res.send('Hello from Auth Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});