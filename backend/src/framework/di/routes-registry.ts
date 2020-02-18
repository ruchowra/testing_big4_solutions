import { isUndefined } from 'util';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from 'express';
import { Container } from 'inversify';
import IApiController from '@framework/interfaces/api-controller';
import IMiddleware from '@framework/interfaces/middleware';
import { TokenPayload } from '@framework/interfaces/request';
import TYPES from '@framework/di/types';

const rethrow = (error: Error): void => {
  if (typeof process.env.DEBUG !== 'undefined') {
    process.stderr.write(`Error thrown: ${error.message}\n${error.stack}\n`);
  } else {
    throw error;
  }
};

const asyncRoute = (route: RequestHandler): RequestHandler => (req: Request,
  res: Response,
  next: NextFunction = rethrow): void  => { // eslint-disable-line
  Promise.resolve(route(req, res, next)).catch(next);
};

class RoutesRegistry {
  private static router: Router = undefined;
  private static routes: string[] = [];

  private static initialize(): void {
    try {
      RoutesRegistry.router = Router();
      RoutesRegistry.router.post('*', (req: Request, res: Response, next: NextFunction): any => { // eslint-disable-line
        if (isUndefined(req.headers['content-type'])
        || req.headers['content-type'] !== 'application/json') {
          res.status(400);
          res.json('{ "success":false, "data": {}, "error": {"code": 400, "message": "Invalid Request"}');
        } else {
          next();
        }
      });
    } catch (err) {
      process.stderr.write(`Initialization of router failed: ${err.message}\n${err.stack}\n`);
      throw err;
    }
  }

  public static async registerController(controller: IApiController,
    controllerName: string,
    container: Container): Promise<void> {
    try {
      if (typeof RoutesRegistry.router === 'undefined') {
        RoutesRegistry.initialize();
      }
      const actions: string[] = Reflect.getMetadata('controller:actions', controller);
      const moduleName: string = Reflect.getMetadata('controller:module', controller);
      actions.forEach((actionName: string): void => {
        const method: 'get' | 'put' | 'post' | 'delete' | 'patch' = Reflect.getMetadata('action:method', controller, `${actionName}Action`);
        const endpoint: string = Reflect.getMetadata('action:endpoint', controller, `${actionName}Action`);
        const permission: string = Reflect.getMetadata('action:permission', controller, `${actionName}Action`);

        let middlewareList: string[] = [];
        if (Reflect.hasMetadata('action:middleware', controller, `${actionName}Action`)) {
          middlewareList = Reflect.getMetadata('action:middleware', controller, `${actionName}Action`);
        }
        let tokenPayload: TokenPayload;
        middlewareList.forEach((middlewareName: string): void => {
          const url = (`/${process.env.APIROOT}/${moduleName}/${endpoint}`).replace(/\/\//g, '/');
          RoutesRegistry.Router[method](url, asyncRoute(async (req: Request,
            res: Response,
            next: NextFunction): Promise<void> => {
            const middleware = container.getNamed<IMiddleware>(TYPES.Middleware, middlewareName);
            middleware.Request.setRequest(req);
            if (typeof tokenPayload !== 'undefined') {
              middleware.Request.TokenPayload = tokenPayload;
            }
            middleware.Response.setResponse(res);
            const result = await middleware.action();
            if (result) {
              if (typeof middleware.Request.TokenPayload !== 'undefined') {
                tokenPayload = middleware.Request.TokenPayload;
              }
              next();
            } else {
              const [response, body] = middleware.Response.transform();
              if (isUndefined(body) || Object.keys(body).length === 0) {
                response.send();
              } else {
                response.json(body);
              }
            }
          }));
        });
        const url = (`/${process.env.APIROOT}/${moduleName}/${endpoint}`).replace(/\/\//g, '/');
        RoutesRegistry.routes.push(`${method.toUpperCase()} ${url}`);
        RoutesRegistry.Router[method](url, asyncRoute(async (req: Request, res: Response): Promise<void> => {
          const { params, query } = req;
          const reqBody = req.body;
          const ApiController = container.getNamed<IApiController>(TYPES.ApiController, controllerName);
          ApiController.Request.setRequest(req);
          ApiController.Response.setResponse(res);
          if (typeof tokenPayload !== 'undefined') {
            ApiController.Request.TokenPayload = tokenPayload;
          }
          /*
            Starting from the right, Object.assign copies all the members
            of each object into the previous one in the list, overwriting any
            common keys.
            In this case, that means our params copy into the list of query variables,
            the result is copied into the route defaults and the whole thing is
            placed into an empty object.
            This way, we can easily apply defaults values to our routes,
            and get both query string value and route parameters from the same input object.
          */

          // preDispatch, and postDispatch are allowed to manipulate the response object freely,
          // as long as the underlying transform() function can still retrieve
          // a valid express result at the end.
          const parameters = Object.assign({}, query, params, reqBody);
          let allowed = true;
          if (typeof ApiController.Request.TokenPayload !== 'undefined' && permission !== '') {
            let ack: any = ApiController.Request.TokenPayload.permissions; // eslint-disable-line
            permission.split('.').forEach((path: string): void => {
              if (typeof ack === 'undefined' || ack[path] === false) {
                allowed = false;
              }
              if (path && path[0] === ':' && typeof parameters[path] !== 'undefined') {
                ack = ack[parameters[path]];
              } else if (path) {
                ack = ack[path];
              }
            });
          }
          if (allowed) {
            await ApiController.preDispatch();
            await ApiController.dispatch(actionName, parameters);
            await ApiController.postDispatch();
            const [response, body] = ApiController.Response.transform();
            if (isUndefined(body) || Object.keys(body).length === 0) {
              response.send();
            } else {
              response.json(body);
            }
          } else {
            res.statusCode = 403;
            res.json({
              success: false,
              data: {
                message: 'Unauthorized',
              },
            });
          }
        }));
      });
    } catch (err) {
      process.stderr.write(`Failed to load routes from ${controller}
  Error: ${err.message}
  Stack: ${err.stack}
`);
    }
  }

  public static get Router(): Router {
    return RoutesRegistry.router;
  }

  public static get Routes(): string[] {
    return RoutesRegistry.routes;
  }
}

export default RoutesRegistry;
