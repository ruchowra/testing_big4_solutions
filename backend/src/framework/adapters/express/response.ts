import IResponse from '@framework/interfaces/response';
import * as express from 'express';
import { injectable } from 'inversify';
import { OutgoingHttpHeaders } from 'http';
import { isUndefined } from 'util';

@injectable()
class Response extends IResponse {
  protected res: express.Response;

  public setResponse(res: express.Response): void {
    this.res = res;
  }

  public setHeader(name: string, value: string): IResponse {
    this.res.setHeader(name, value);
    return this;
  }

  public setStatusCode(code: number): IResponse {
    this.res.statusCode = code;
    return this;
  }

  public setBody(body: object): IResponse {
    this.body = body;
    return this;
  }

  public get Headers(): OutgoingHttpHeaders {
    return this.res.getHeaders();
  }

  public get StatusCode(): number {
    return this.res.statusCode;
  }

  public get Body(): object {
    return this.body;
  }

  public transform(): [express.Response, object] {
    return [this.res, this.body];
  }

  public get response(): express.Response {
    return this.res;
  }

  /* eslint-disable */
  public get(key: string): any {
    if (!isUndefined((this.res as any)[key])) {
      return (this.res as any)[key];
    }
    throw new Error(`key '${key}' is undefined.`);
  }

  public set(key: string, value: any): IResponse {
    (this.res as any)[key] = value;
    return this;
  }
  /* eslint-enable */
}

export default Response;
