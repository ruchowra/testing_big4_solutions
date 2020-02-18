import IRequest from '@framework/interfaces/request';
import { injectable } from 'inversify';
import * as express from 'express';
import { isUndefined } from 'util';

@injectable()
class Request extends IRequest {
  protected req: express.Request;

  public setRequest(req: express.Request): void {
    this.req = req;
  }

  public get method(): string {
    return this.req.method.toLowerCase();
  }

  public getHeader(name: string): string | string[] | undefined {
    return this.req.get(name);
  }

  public get params(): object {
    return this.req.params;
  }

  public isContentType(type: string): boolean {
    const contentType = this.req.is(type);
    return !isUndefined(contentType) && contentType !== false;
  }

  public get url(): string {
    return this.req.url;
  }

  public get baseUrl(): string {
    return this.req.baseUrl;
  }

  public get cleanUrl(): string {
    return this.req.url.split('?')[0];
  }

  public getQueryString(override: { [key: string]: string }): string {
    let queryString = '?';
    const { query } = this.req;
    Object.assign(query, override);
    Object.keys(query).forEach((key: string): void => {
      const val = encodeURIComponent(query[key]);
      if (queryString.length > 1) {
        queryString += `&${key}=${val}`;
      } else {
        queryString += `${key}=${val}`;
      }
    });
    return queryString.length > 1 ? queryString : '';
  }

  public get request(): express.Request {
    return this.req;
  }

  /* eslint-disable */
  public get(key: string): any {
    if (!isUndefined((this.req as any)[key])) {
      return (this.req as any)[key];
    }
    throw new Error(`key '${key}' is undefined.`);
  }

  public set(key: string, value: any): IRequest {
    (this.req as any)[key] = value;
    return this;
  }
  /* eslint-enable */
}

export default Request;
