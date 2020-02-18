/* eslint no-param-reassign: 0 */

// Api Controller decorator.
// Automatically populates the class' list of available action names.
import 'reflect-metadata';
import IApiController from '@framework/interfaces/api-controller';

interface ApiActions {
  [key: string]: {
    (...rest: any[]): Promise<void>; // eslint-disable-line
  };
}

interface Constructor<T extends IApiController> {
  new(): T;
}

function Module<T extends IApiController>(target: Constructor<T>): Constructor<T> {
  if (!Reflect.hasOwnMetadata('controller:actions', target.prototype)) {
    throw new TypeError(`Error: ${target} has no defined actions.`);
  }
  const actionList = Reflect.getOwnMetadata('controller:actions', target.prototype);
  const actions: ApiActions = {};
  actionList.forEach((actionName: string): void => {
    actions[actionName] = target.prototype[`${actionName}Action`];
  });

  target.prototype.controllerActions = actions;

  return target;
}

export default Module;
