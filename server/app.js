import dotenv from 'dotenv';
import express from 'express';
import errorMiddleware from './middleware/Error.middleware.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import listingRoute from './routes/listing.route.js';

dotenv.config({
  path: 'server/config/config.env',
});

const app = express();

export default app;
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/listing', listingRoute);
app.use(errorMiddleware);
