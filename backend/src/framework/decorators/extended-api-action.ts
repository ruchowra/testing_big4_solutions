import IApiController from '@framework/interfaces/api-controller';
import ApiAction from './api-action';
import Route from './route';
import Module from './api-permission';
import UseMiddleware from './middleware';

function ExtApiAction(method: 'get'|'post'|'put'|'delete'|'patch',
  endpoint: string,
  actionParameters: ([string, any] | string)[], // eslint-disable-line
  permissions?: string,
  authenticate: boolean = true,
  middleware?: [string]): (target: IApiController,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor) => PropertyDescriptor {
  return function decoratorFunction(target: IApiController,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const ApiActionDecorator = ApiAction(actionParameters);
    const RouteDecorator = Route(method, endpoint);
    let result = propertyDescriptor;
    if (authenticate && Boolean(process.env.DEBUG) === false) {
      result = UseMiddleware('Authentication')(target, propertyKey, result);
    }
    if (permissions) {
      result = Module(permissions)(target, propertyKey, result);
    }
    if (typeof middleware !== 'undefined' && Array.isArray(middleware) && middleware.length > 0) {
      middleware.forEach((name: string): void => {
        result = UseMiddleware(name)(target, propertyKey, result);
      });
    }
    return ApiActionDecorator(target, propertyKey, RouteDecorator(target, propertyKey, result));
  };
}

export default ExtApiAction;
