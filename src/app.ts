import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import {passportMiddleware} from './middlewares';
import routes from './routes';

// initializations
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passport.use(passportMiddleware);

// routes
app.use(routes)

export default app;
