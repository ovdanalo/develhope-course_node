import express from 'express';
import 'express-async-errors';
import { initCorsMiddleware } from '../lib/middleware/cors';

import { validationErrorMiddleware } from '../lib/middleware/validation';
import { initSessionMiddleware } from '../lib/middleware/session';
import { passport } from '../lib/middleware/passport';
import {
    notFoundMiddleware,
    initErrorMiddleware
} from '../lib/middleware/error'

import planetsRoutes from './routes/planets';
import authRoutes from './routes/auth';


const app = express();

app.use(initSessionMiddleware(app.get("env")));

app.use(passport.initialize());

app.use(passport.session());

app.use(express.json());

app.use(initCorsMiddleware())

app.use('/planets', planetsRoutes)
app.use("/auth", authRoutes)

app.use(notFoundMiddleware);

app.use(validationErrorMiddleware);
app.use(initErrorMiddleware(app.get("env")))
export default app;
