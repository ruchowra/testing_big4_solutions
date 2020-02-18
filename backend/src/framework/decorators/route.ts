import IApiController from '@framework/interfaces/api-controller';

function Route(method: 'get'|'post'|'put'|'delete'|'patch', endpoint: string): (target: IApiController, propertyKey: string, propertyDescriptor: PropertyDescriptor) => PropertyDescriptor {
  return function decoratorFunction(target: IApiController,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    if (!(target instanceof IApiController)) {
      throw new TypeError('ApiAction decorator is only valid on targets of type IApiController');
    }
    if (!propertyKey.endsWith('Action')) {
      throw new TypeError('Action names must end with \'Action\'');
    }
    Reflect.defineMetadata('action:method', method.toLowerCase(), target, propertyKey);
    Reflect.defineMetadata('action:endpoint', endpoint, target, propertyKey);

    return propertyDescriptor;
  };
}

export default Route;
