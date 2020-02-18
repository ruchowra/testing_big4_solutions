/* eslint class-methods-use-this: 0 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import IRequest from '@framework/interfaces/request';
import IResponse from '@framework/interfaces/response';

import TYPES from '@framework/di/types';
import { isUndefined } from 'util';

interface Parameter {
  index: number;
  type: string;
  default?: any; // eslint-disable-line
}

interface ParameterList {
  [key: string]: Parameter;
}

interface ParamObject {
  [key: string]: any; // eslint-disable-line
}

interface ApiActionCollection {
  [key: string]: {
    (...rest: any[]): Promise<void>; // eslint-disable-line
  };
}

interface ActionParameters {
  [key: string]: ParameterList;
}

interface PermissionObject {
  [key: string]: boolean | PermissionObject;
}

@injectable()
abstract class IApiController {
  protected actionParameters: ActionParameters;

  public async dispatch(action: string, parameters: ParamObject): Promise<void> {
    try {
      if (this.actionParameters[action] === undefined || this.controllerActions[action] === undefined) {
        throw new Error(`Action ${action} does not exist on Controller ${this.toString()}.`);
      }
      const actionParamKeys = Object.keys(this.actionParameters[action]);
      const actionParameters: any[] = Array(actionParamKeys.length); // eslint-disable-line
      for (let index = 0; index < actionParamKeys.length; index++) {
        const key = actionParamKeys[index];
        const parameterDefinition = this.actionParameters[action][key];
        const parameterPassed = parameters[key] !== undefined;
        if (parameterPassed) {
          let parameterValue: any; // eslint-disable-line
          switch (parameterDefinition.type.toLowerCase()) {
            case 'string':
              parameterValue = String(parameters[key]);
              break;
            case 'number':
              parameterValue = Number(parameters[key]);
              break;
            case 'array':
              parameterValue = parameters[key].split(',');
              break;
            case 'object':
              parameterValue = JSON.parse(parameters[key]);
              break;
            case 'boolean':
              parameterValue = Boolean(parameters[key]);
              break;
            default:
              if (parameterDefinition.default !== undefined) {
                parameterValue = parameterDefinition.default;
              } else {
                throw new TypeError(`Parameter ${key} passed to action function is of unsupported type.`);
              }
          }
          actionParameters[parameterDefinition.index] = parameterValue;
        } else {
          if (parameterDefinition.default === undefined) {
            actionParameters[parameterDefinition.index] = undefined;
          }
          actionParameters[parameterDefinition.index] = parameterDefinition.default;
        }
      }
      const actionName = action.endsWith('Action') ? action.slice(0, -6) : action;
      const actionFun = this.controllerActions[actionName];
      const propertyKey = actionName.endsWith('Action') ? actionName : `${actionName}Action`;
      let hasPermission = true;
      if (Reflect.hasMetadata('action:permission',
        this,
        propertyKey)) {
        const permissionPath = Reflect.getMetadata('action:permission', this, propertyKey).split('.');
        let permission: PermissionObject = this.request.Permissions;
        permissionPath.forEach((pathElement: string): void => {
          const next = (pathElement.startsWith(':')
            ? actionParameters[this.actionParameters[action][pathElement.slice(1)].index]
            : pathElement);
          if (!isUndefined(permission) || !hasPermission) {
            if (isUndefined(permission[next])) {
              hasPermission = false;
            } else if (typeof permission[next] === 'boolean') {
              hasPermission = permission[next] as boolean;
            } else {
              permission = permission[next] as PermissionObject;
            }
          }
        });
      }
      if (!hasPermission) {
        this.statusCode = 403;
        this.body = {
          message: 'Forbidden action',
        };
        return;
      }
      await actionFun.apply(this, actionParameters);
    } catch (err) {
      throw err;
    }
  }

  protected controllerActions: ApiActionCollection;

  @inject(TYPES.Request) protected request: IRequest;

  @inject(TYPES.Response) protected response: IResponse;

  public setActionParameters(name: string, Parameters: ParameterList): void {
    if (this.actionParameters === undefined) {
      this.actionParameters = {};
    }
    this.actionParameters[name] = Parameters;
  }

  public get Request(): IRequest {
    return this.request;
  }

  public set Request(value: IRequest) {
    this.request = value;
  }

  public get Response(): IResponse {
    return this.response;
  }

  public set Response(value: IResponse) {
    this.response = value;
  }

  public async preDispatch(): Promise<void> {
    return new Promise((resolve): void => resolve());
  }

  public async postDispatch(): Promise<void> {
    return new Promise((resolve): void => resolve());
  }

  public set body(value: object) {
    this.response.setBody(value);
  }

  public get body(): object {
    return this.response.Body;
  }

  public set statusCode(code: number) {
    this.response.setStatusCode(code);
  }

  public get statusCode(): number {
    return this.response.StatusCode;
  }
}

export default IApiController;
export { ApiActionCollection };
