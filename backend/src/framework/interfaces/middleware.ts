/* eslint @typescript-eslint/no-explicit-any: 0 */

import { injectable, inject } from 'inversify';
import TYPES from '@framework/di/types';
import IRequest from './request';
import IResponse from './response';

interface ParamObject {
  [key: string]: string;
}

@injectable()
abstract class IMiddleware {
  @inject(TYPES.Request) protected request: IRequest;
  @inject(TYPES.Response) protected response: IResponse;

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

  public async abstract action(): Promise<boolean>;
}

export default IMiddleware;
