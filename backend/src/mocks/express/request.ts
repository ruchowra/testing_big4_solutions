import { injectable } from 'inversify';
import IRequest from '@framework/interfaces/request';
import { isUndefined, isNullOrUndefined } from 'util';

interface RequestObject {
  method: string;
  type: string;
  params: {
    [key: string]: string;
  };
  query: {
    [key: string]: string;
  };
  url: string;
  baseUrl: string;
}

@injectable()
export default class MockRequest extends IRequest {
  private req: RequestObject;

  public setRequest(req: RequestObject): void {
    this.req = req;
  }

  public get method(): string {
    return this.req.method;
  }

  public getHeader(name: string): string | string[] | undefined {
    return this.headers[name];
  }

  public isContentType(type: string): boolean {
    return this.req.type === type;
  }

  public get params(): object {
    return this.req.params;
  }

  public get url(): string {
    return this.req.url;
  }

  public get cleanUrl(): string {
    return this.req.url.split('?')[0];
  }

  public get baseUrl(): string {
    return this.req.baseUrl;
  }

  public getQueryString(override: { [key: string]: string }): string {
    let queryString = '?';
    const { query } = this.req;
    if (isNullOrUndefined(query)) {
      return '';
    }
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

  public get request(): RequestObject {
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
