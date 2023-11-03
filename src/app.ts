import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import router from './routes';
import { logger } from './utils/logger';
import { connectDb } from './utils/db';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
    // Need to add this to allow the client to read the new access token from the response header otherwise this header will not be accessible in the client
    exposedHeaders: ['New-Access-Token'],
  })
);
app.use(
  rateLimit({
    max: 3000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
);

app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, async () => {
  logger.info(`Server running on http://localhost:${port}`);

  await connectDb();
});
