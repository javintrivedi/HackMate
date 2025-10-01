import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import './Modules/db.js';

import AuthRouter from './Routes/AuthRouter.js';
import ProfileRouter from './Routes/ProfileRouter.js';
import MatchRouter from './Routes/MatchRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow multiple origins
const allowedOrigins = [
  "https://hack-mate-ten.vercel.app", // deployed frontend
  "http://localhost:5173"             // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

// Routers
app.use('/auth', AuthRouter);
app.use('/profile', ProfileRouter);
app.use('/match', MatchRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
