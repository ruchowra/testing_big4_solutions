import IApiController from '@framework/interfaces/api-controller';

function UseMiddleware(name: string): (target: IApiController,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor) => PropertyDescriptor {
  return function decoratorFunction(target: IApiController,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    if (!propertyKey.endsWith('Action')) {
      throw new TypeError('Middleware can only be placed on API Action methods!');
    }
    let MiddlewareList = [name];
    if (Reflect.hasMetadata('action:middleware', target, propertyKey)) {
      const OldMiddleware = Reflect.getMetadata('action:middleware', target, propertyKey);
      MiddlewareList = MiddlewareList.concat(
        OldMiddleware.filter((middleware: string): boolean => {
          return middleware !== name;
        }),
      );
    }
    Reflect.defineMetadata('action:middleware', MiddlewareList, target, propertyKey);
    return propertyDescriptor;
  };
}

export default UseMiddleware;
