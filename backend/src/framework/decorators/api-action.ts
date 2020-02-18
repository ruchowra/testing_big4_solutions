/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-implicit-any: 0 */
/* eslint no-param-reassign: 0 */
// Action decorator, takes a param object and type-converts its members
// to match the parameter list of an action function.
import 'reflect-metadata';
import IApiController from '@framework/interfaces/api-controller';

interface Parameter {
  index: number;
  type: string;
  default?: any;
}

interface ParameterList {
  [key: string]: Parameter;
}

function ApiAction(actionParameters: ([string, any] | string)[]): (target: IApiController,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor) => PropertyDescriptor {
  return function decoratorFunction(target: IApiController,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    if (!(target instanceof IApiController)) {
      throw new TypeError('ApiAction decorator is only valid on targets of type IApiController');
    }
    if (!propertyKey.endsWith('Action')) {
      throw new TypeError('Action names must end with \'Action\'');
    }
    const types = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
    const parameterTypes = types.map((a: any): string => a.name);
    const parameterList: ParameterList = {};
    for (let index = 0; index < actionParameters.length; index++) {
      const parameter = actionParameters[index];
      const parameterDefinition: Parameter = {
        index,
        type: parameterTypes[index],
      };
      if (typeof parameter === 'string') {
        parameterList[parameter as string] = parameterDefinition;
      } else {
        if (parameter.length === 2) {
          [, parameterDefinition.default] = parameter;
        }
        parameterList[parameter[0]] = parameterDefinition;
      }
    }
    const actionName = propertyKey.endsWith('Action') ? propertyKey.slice(0, -6) : propertyKey;
    target.setActionParameters(actionName, parameterList);
    let actionList: string[];
    if (Reflect.hasOwnMetadata('controller:actions', target)) {
      actionList = Reflect.getOwnMetadata('controller:actions', target);
      actionList.push(actionName);
    } else {
      actionList = [actionName];
    }
    Reflect.defineMetadata('controller:actions', actionList, target);

    return propertyDescriptor;
  };
}

export default ApiAction;
