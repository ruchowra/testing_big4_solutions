import IApiController from '@framework/interfaces/api-controller';

interface Constructor<T extends IApiController> {
  new(): T;
}

function Route<T extends IApiController>(name: string): (target: Constructor<T>) => Constructor<T> {
  return function decoratorFunction(target: Constructor<T>): Constructor<T> {
    Reflect.defineMetadata('controller:module', name, target.prototype);
    return target;
  };
}

export default Route;
