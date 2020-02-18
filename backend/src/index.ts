import 'module-alias/register';
import { isUndefined } from 'util';
import * as fs from 'fs';
import * as Express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as CookieParser from 'cookie-parser';
import RoutesRegistry from '@framework/di/routes-registry';
import BindInterfaces from '@framework/di/inversify.config';
import eventBootstrap from '@events/bootstrap-events';
import eventHandlerBootstrap from '@event-handlers/bootstrap-event-handlers';
import TYPES from '@framework/di/types';
import IPersistence from '@framework/interfaces/persistence';
import envLoader from './envloader';

import {initDb} from '@framework/database/db';


//CORS: Harish
var cors = require('cors');



eventBootstrap();
eventHandlerBootstrap();


// Make an asynchronous start function so we can use await
// for things like interface binding, mongodb and mysql connections etc.
async function start(): Promise<void> {
  try {
    // Read ../.env
    envLoader('./config/.env');
    process.env.counter = '0';
    process.env.ROOTDIR = path.resolve(__dirname);

    const apiServer = Express();
    

    const container = await BindInterfaces();
    container.getNamed<IPersistence>(TYPES.Persistence, 'Db');
    /* Setup body parser */
    apiServer.use(bodyParser.json());
    apiServer.use(CookieParser());

    // Debug printing to the console.
    if (process.env.DEBUG) {
      console.log('Harish: This node env is ', process.env.NODE_ENV)
      apiServer.use(cors())
      // if (process.env.NODE_ENV == 'prod') {
      //   apiServer.use(cors())
      //   console.log('Harish:  CORS set ', process.env.NODE_ENV)
      // }
    
      
      apiServer.use('*', (req: Express.Request, _res: Express.Response, next: Express.NextFunction): void => {
        process.stdout.write(`Saw ${req.method} request to ${req.originalUrl}\n`);
        next();
      });
    }

    // Read and resolve API routes
    const router: Express.Router = RoutesRegistry.Router;
    process.stdout.write(`Found routes:\n${JSON.stringify(RoutesRegistry.Routes, null, 2)}\n`);

    apiServer.use('/', router);

    /* Setup error handlers */
    apiServer.use('*', (
      req: Express.Request,
      res: Express.Response,
      _next: Express.NextFunction,
    ): void => {
      if (isUndefined(process.env.DEBUG)) {
        fs.writeFileSync('logs/error.log', `${req.url} not found.\n`, { encoding: 'utf8', flag: 'a+' });
      } else {
        process.stderr.write(`${req.originalUrl} not found.\n`);
      }
      res.status(404).json({ message: `404: ${req.originalUrl} not found` });
    });

    apiServer.use((
      err: Error,
      _req: Express.Request,
      res: Express.Response,
      _next: Express.NextFunction,
    ): void => {
      if (isUndefined(process.env.DEBUG)) {
        fs.writeFileSync('logs/error.log', `${err.stack}.\n`, { encoding: 'utf8', flag: 'a+' });
      } else {
        process.stderr.write(`${err.stack}.\n`);
      }
      res.status(500).json({ message: '500 internal server error' });
    });

    if (isUndefined(process.env.PORT)) {
      process.stderr.write('ERROR: PORT environment variable not set!\n');
    }

    initDb(function (err:any) {
      if (err) {
          throw err; //
      }
      process.stdout.write(`API Up and running on port  ${process.env.PORT} ${process.env.DEBUG ? ' in debug mode' : ''}...\n`);
      apiServer.listen(process.env.PORT, (): void => {
        process.stdout.write('Server running!\n');
      });
    }
    );
    
  } catch (err) {
    process.stderr.write(`Caught exception '${err}'\n${err.stack}`);
  }
}

start();
