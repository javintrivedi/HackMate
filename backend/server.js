import express from 'express';
import dotenv from 'dotenv';

import './Modules/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';

import AuthRouter from './Routes/AuthRouter.js';
import ProfileRouter from './Routes/ProfileRouter.js';
import MatchRouter from './Routes/MatchRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// your deployed backend URL (or set SELF_URL in env)
const SELF_URL = process.env.SELF_URL || 'https://hack-mate-backend.onrender.com';

app.use(cors({
  origin: 'https://hack-mate-ten.vercel.app',
  credentials: true
}));

app.use(bodyParser.json());

app.use('/auth', AuthRouter);
app.use('/profile', ProfileRouter);
app.use('/match', MatchRouter);

app.get('/', (req, res) => {
  res.send('Hello from Auth Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // 🔄 Self-ping every 14 minutes to prevent Render sleep
  setInterval(() => {
    fetch(SELF_URL)
      .then(res => console.log(`[self-ping] status: ${res.status}`))
      .catch(err => console.error('[self-ping] failed:', err));
  }, 14 * 60 * 1000); // 14 minutes
});
