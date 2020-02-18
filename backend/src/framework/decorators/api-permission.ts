/* eslint no-param-reassign: 0 */
// Action decorator, takes a param object and type-converts its members
// to match the parameter list of an action function.
import 'reflect-metadata';
import IApiController from '@framework/interfaces/api-controller';

function Module(permission: string): (target: IApiController,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor) => PropertyDescriptor {
  return function decoratorFunction(target: IApiController,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    if (!(target instanceof IApiController)) {
      throw new TypeError('ApiAction decorator is only valid on targets of type IApiController');
    }
    if (!propertyKey.endsWith('Action')) {
      throw new TypeError('Permissions can only be placed on API Action methods!');
    }
    Reflect.defineMetadata('action:permission', permission, target, propertyKey);

    return propertyDescriptor;
  };
}

export default Module;
