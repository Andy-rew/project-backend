import polka from 'polka';
import sendtype from '@polka/send-type';
import { STATUS_CODES } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import ConnectSessionSequelize from 'connect-session-sequelize';
import helmet from 'helmet';
import morgan from 'morgan';
import serveStatic from 'serve-static';

import './config/passport';
import asyncHandler from './util/asyncHandler';
import logger, { LoggerStream } from './util/logger';
import sequelize from './sequelize';
import { ENVIRONMENT, FRONTEND_APP_URL, SESSION_SECRET } from './util/secrets';

// models
//import { User, UserRoles } from './models/Person';

// controllers
 import * as userController from './controllers/user';
import {
  deleteAccidents,
  deletePerson,
  editAccident,
  getAccidentsOfPerson,
  getPeople, getProtocol,
  personAccidents
} from './controllers/user';
// import * as loggingController from './controllers/logging';
// import * as adminController from './controllers/admin';

const prod = ENVIRONMENT === 'production';

// CORS OPTIONS, WHITELIST
let whitelist = [FRONTEND_APP_URL];
if (!prod) {
  const devWhiteList: string[] = [];
  whitelist = whitelist.concat(devWhiteList);
}
export const corsOptions = {
  credentials: true,
  origin(
    origin: string,
    callback: (err: Error, isCorrect?: boolean) => void
  ): void {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} not allowed by CORS`));
    }
  },
};


// Create Polka server
const app = polka({
  onError: (err: any, req: any, res) => {
    const code = err.code || err.status || 500;
    const data = (err.length && err) || err.message;
    const realErrMessage = (data && data.message) || data || STATUS_CODES[code];
    const sendReal = !prod || process.env.STAGING === 'true';
    const errorMessage = sendReal ? realErrMessage : STATUS_CODES[code];



    if (ENVIRONMENT === 'test') {
      console.error(err);
    }

    return sendtype(res, code, {
      message: errorMessage,
      ...(sendReal ? { stack: err.stack } : {}),
    });
  },
});

// Polka configuration
app.use(helmet());
app.use(cors(corsOptions));

const staticPathPrefix = 'data/public';
export const staticPath = staticPathPrefix + '/api';
app.use('/etuclasses', serveStatic(staticPathPrefix));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

// Session things
// const SequelizeStore = ConnectSessionSequelize(session.Store);
// const store = new SequelizeStore({
//   db: sequelize,
//   table: 'Session',
//   extendDefaultFields: (defaults, session) => ({
//     data: defaults.data,
//     userId: session.passport?.user?.id,
//   }),
// });
// export const sessionMiddleware = session({
//   resave: false,
//   saveUninitialized: false,
//   secret: SESSION_SECRET,
//   store,
// });

//app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Morgan
const morganFormat =
  prod || process.env.FORCE_PROD === 'true'
    ? '":remote-addr",":req[x-real-ip]",":remote-user",":auth-user",":method :url HTTP/:http-version",":status",":response-time ms",":res[content-length]",":referrer",":user-agent"'
    : 'dev';


app.use(morgan(morganFormat, { stream: new LoggerStream() }));

// Global middlewares
app.use((req: any, res, next) => {
  res.setHeader('Accept', 'application/json');
  req.middlewareData = {};
  next();
});


/**
 * Primary app routes.
 *
 */
export const pathPrefix = '/api';


app.get(`${pathPrefix}/accidents`, asyncHandler(userController.getAccidents));
app.get(`${pathPrefix}/accidents/personal/:id`, asyncHandler(userController.getAccidentsOfPerson));
app.get(`${pathPrefix}/people`, asyncHandler(userController.getPeople));
app.get(`${pathPrefix}/accidents/date`, asyncHandler(userController.getAccidentsDate));
app.delete(`${pathPrefix}/accidents/delete/:id`, asyncHandler(userController.deleteAccidents));
app.get(`${pathPrefix}/accidents/protocol/:id`, asyncHandler(userController.getProtocol));
app.delete(`${pathPrefix}/people/delete/:id`, asyncHandler(userController.deletePerson));
app.put(`${pathPrefix}/people/set/:id`, asyncHandler(userController.editPerson));
app.put(`${pathPrefix}/accidents/set/:id`, asyncHandler(userController.editAccident));
app.post(`${pathPrefix}/people/create`, asyncHandler(userController.createPerson));
app.post(`${pathPrefix}/accidents/create`, asyncHandler(userController.createAccident));
app.post(`${pathPrefix}/accidents/set/personal`, asyncHandler(userController.personAccidents));

export default app;
