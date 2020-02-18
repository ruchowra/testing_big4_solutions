import { OutgoingHttpHeaders } from 'http';
import { injectable } from 'inversify';
import { isUndefined } from 'util';
import IResponse from '@framework/interfaces/response';

interface ResponseObject {
  statusCode: number;
}

@injectable()
export default class MockResponse extends IResponse {
  private res: ResponseObject;

  public setResponse(res: ResponseObject): void {
    this.res = res;
  }

  public get Headers(): OutgoingHttpHeaders {
    return this.Headers;
  }

  public get StatusCode(): number {
    return this.res.statusCode;
  }

  public get Body(): object {
    return this.body;
  }

  public setHeader(name: string, value: string): IResponse {
    this.Headers[name] = value;
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

  public transform(): [ResponseObject, object] {
    return [this.res, this.body];
  }

  public get response(): ResponseObject {
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
